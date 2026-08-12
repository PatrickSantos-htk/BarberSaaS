import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSlotAvailable } from "@/lib/booking/availability";
import { formatPhoneBR } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const { serviceId, date, time, clientName, clientPhone } = body ?? {};

  if (!serviceId || !date || !time || !clientName?.trim() || !clientPhone?.trim()) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, business_hours_start, business_hours_end")
    .eq("slug", slug)
    .single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Barbearia não encontrada." }, { status: 404 });
  }

  const { data: service, error: serviceError } = await admin
    .from("services")
    .select("id, price, duration_minutes")
    .eq("id", serviceId)
    .eq("user_id", profile.id)
    .single();
  if (serviceError || !service) {
    return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
  }

  // Revalida no servidor — evita dois visitantes garantindo o mesmo horário
  // ao mesmo tempo entre o momento em que a lista de horários foi buscada e
  // o clique em confirmar.
  const { data: appointments, error: appointmentsError } = await admin
    .from("appointments")
    .select("time, service:services(duration_minutes)")
    .eq("user_id", profile.id)
    .eq("date", date)
    .neq("status", "CANCELED");
  if (appointmentsError) {
    return NextResponse.json({ error: "Erro ao consultar agenda." }, { status: 500 });
  }

  const busy = (appointments ?? []).map((appointment) => ({
    time: appointment.time.slice(0, 5),
    durationMinutes:
      (appointment.service as unknown as { duration_minutes: number } | null)?.duration_minutes ?? 30,
  }));

  const stillAvailable = isSlotAvailable({
    time,
    businessHoursStart: profile.business_hours_start.slice(0, 5),
    businessHoursEnd: profile.business_hours_end.slice(0, 5),
    serviceDurationMinutes: service.duration_minutes,
    busy,
  });
  if (!stillAvailable) {
    return NextResponse.json(
      { error: "Esse horário acabou de ser preenchido. Escolha outro." },
      { status: 409 }
    );
  }

  const formattedPhone = formatPhoneBR(clientPhone);
  const phoneDigits = clientPhone.replace(/\D/g, "");

  const { data: existingClients } = await admin
    .from("clients")
    .select("id, phone")
    .eq("user_id", profile.id);
  const existingClient = existingClients?.find((client) => client.phone.replace(/\D/g, "") === phoneDigits);

  let clientId = existingClient?.id as string | undefined;
  if (!clientId) {
    const { data: newClient, error: newClientError } = await admin
      .from("clients")
      .insert({ name: clientName.trim(), phone: formattedPhone, email: "", user_id: profile.id })
      .select("id")
      .single();
    if (newClientError || !newClient) {
      return NextResponse.json({ error: "Não foi possível registrar o cliente." }, { status: 500 });
    }
    clientId = newClient.id;
  }

  const { error: insertError } = await admin.from("appointments").insert({
    client_id: clientId,
    service_id: service.id,
    date,
    time,
    price: service.price,
    user_id: profile.id,
  });
  if (insertError) {
    return NextResponse.json({ error: "Não foi possível criar o agendamento." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
