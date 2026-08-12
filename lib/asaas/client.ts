if (typeof window !== "undefined") {
  throw new Error("lib/asaas/client.ts usa a chave secreta da Asaas e só pode rodar no servidor.");
}

const ASAAS_API_URL = process.env.ASAAS_API_URL ?? "https://api-sandbox.asaas.com/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!ASAAS_API_KEY) {
    throw new Error("ASAAS_API_KEY não está definida em .env.local");
  }

  const response = await fetch(`${ASAAS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
      ...init?.headers,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    const message = body?.errors?.[0]?.description ?? "Erro na API da Asaas";
    throw new Error(message);
  }
  return body as T;
}

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
}

export async function createAsaasCustomer(input: {
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference: string;
}) {
  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type AsaasBillingType = "UNDEFINED" | "PIX" | "CREDIT_CARD" | "BOLETO";

interface AsaasSubscription {
  id: string;
  customer: string;
  status: string;
  value: number;
  nextDueDate: string;
}

export async function createAsaasSubscription(input: {
  customerId: string;
  value: number;
  nextDueDate: string;
  description: string;
  billingType?: AsaasBillingType;
}) {
  return asaasFetch<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customerId,
      billingType: input.billingType ?? "UNDEFINED",
      value: input.value,
      nextDueDate: input.nextDueDate,
      cycle: "MONTHLY",
      description: input.description,
    }),
  });
}

interface AsaasPayment {
  id: string;
  status: string;
  invoiceUrl: string;
  subscription: string;
}

export async function listSubscriptionPayments(subscriptionId: string) {
  return asaasFetch<{ data: AsaasPayment[] }>(`/payments?subscription=${subscriptionId}`);
}
