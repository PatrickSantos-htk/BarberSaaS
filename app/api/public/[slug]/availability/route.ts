import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { computeAvailableSlots } from "@/lib/booking/availability";
import { nowInBrasilia, todayISO } from "@/lib/utils";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json({ error: "Informe data e serviço." }, { status: 400 });
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
    .select("duration_minutes")
    .eq("id", serviceId)
    .eq("user_id", profile.id)
    .single();
  if (serviceError || !service) {
    return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
  }

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

  const isToday = date === todayISO();
  const minStartMinutes = isToday
    ? nowInBrasilia().getHours() * 60 + nowInBrasilia().getMinutes()
    : undefined;

  const slots = computeAvailableSlots({
    businessHoursStart: profile.business_hours_start.slice(0, 5),
    businessHoursEnd: profile.business_hours_end.slice(0, 5),
    serviceDurationMinutes: service.duration_minutes,
    busy,
    minStartMinutes,
  });

  return NextResponse.json({ slots });
}
