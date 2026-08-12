import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAsaasCustomer, createAsaasSubscription, listSubscriptionPayments } from "@/lib/asaas/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { todayISO } from "@/lib/utils";

const MONTHLY_PRICE = 29.9;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const cpfCnpjInput: string | undefined = body?.cpfCnpj;
  const cpfCnpjDigits = cpfCnpjInput?.replace(/\D/g, "");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("shop_name, cpf_cnpj, asaas_customer_id, asaas_subscription_id")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  const finalCpfCnpj = cpfCnpjDigits || profile.cpf_cnpj;
  if (!finalCpfCnpj) {
    return NextResponse.json({ error: "Informe seu CPF ou CNPJ." }, { status: 400 });
  }

  try {
    let customerId = profile.asaas_customer_id as string | null;
    if (!customerId) {
      const customer = await createAsaasCustomer({
        name: profile.shop_name ?? user.email ?? "Barbearia",
        email: user.email ?? "",
        cpfCnpj: finalCpfCnpj,
        externalReference: user.id,
      });
      customerId = customer.id;
    }

    let subscriptionId = profile.asaas_subscription_id as string | null;
    if (!subscriptionId) {
      const subscription = await createAsaasSubscription({
        customerId,
        value: MONTHLY_PRICE,
        nextDueDate: todayISO(),
        description: "BarberSaaS - assinatura mensal",
      });
      subscriptionId = subscription.id;
    }

    // cpf_cnpj é editável pelo próprio dono; os IDs da Asaas não são (ver
    // migration 20260812134256) — por isso a segunda escrita usa o cliente
    // admin em vez da sessão do usuário.
    await supabase.from("profiles").update({ cpf_cnpj: finalCpfCnpj }).eq("id", user.id);
    await getSupabaseAdmin()
      .from("profiles")
      .update({ asaas_customer_id: customerId, asaas_subscription_id: subscriptionId })
      .eq("id", user.id);

    const payments = await listSubscriptionPayments(subscriptionId);
    const invoiceUrl = payments.data?.[0]?.invoiceUrl;

    if (!invoiceUrl) {
      return NextResponse.json({ error: "Assinatura criada, mas sem link de pagamento ainda." }, { status: 502 });
    }

    return NextResponse.json({ invoiceUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar assinatura.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
