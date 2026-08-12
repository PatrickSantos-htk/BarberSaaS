import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const ACTIVE_EVENTS = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"];
const PAST_DUE_EVENTS = ["PAYMENT_OVERDUE"];
const CANCELED_EVENTS = ["SUBSCRIPTION_DELETED", "SUBSCRIPTION_INACTIVATED"];

export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token");
  if (!process.env.ASAAS_WEBHOOK_TOKEN || token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const event: string | undefined = body?.event;
  const subscriptionId: string | undefined = body?.payment?.subscription;

  if (!event || !subscriptionId) {
    return NextResponse.json({ ok: true });
  }

  let status: "active" | "past_due" | "canceled" | null = null;
  if (ACTIVE_EVENTS.includes(event)) status = "active";
  else if (PAST_DUE_EVENTS.includes(event)) status = "past_due";
  else if (CANCELED_EVENTS.includes(event)) status = "canceled";

  if (status) {
    await getSupabaseAdmin()
      .from("profiles")
      .update({ subscription_status: status })
      .eq("asaas_subscription_id", subscriptionId);
  }

  return NextResponse.json({ ok: true });
}
