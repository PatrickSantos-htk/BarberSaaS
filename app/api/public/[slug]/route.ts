import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = getSupabaseAdmin();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, shop_name, business_hours_start, business_hours_end")
    .eq("slug", slug)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Barbearia não encontrada." }, { status: 404 });
  }

  const { data: services, error: servicesError } = await admin
    .from("services")
    .select("id, name, price, duration_minutes")
    .eq("user_id", profile.id)
    .order("name");

  if (servicesError) {
    return NextResponse.json({ error: "Erro ao carregar serviços." }, { status: 500 });
  }

  return NextResponse.json({
    shopName: profile.shop_name,
    businessHoursStart: profile.business_hours_start?.slice(0, 5),
    businessHoursEnd: profile.business_hours_end?.slice(0, 5),
    services: (services ?? []).map((service) => ({
      id: service.id,
      name: service.name,
      price: Number(service.price),
      durationMinutes: service.duration_minutes,
    })),
  });
}
