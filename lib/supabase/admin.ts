import { createClient, type SupabaseClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("lib/supabase/admin.ts usa a secret key e só pode rodar no servidor.");
}

let client: SupabaseClient | null = null;

/**
 * Bypassa RLS — só para o webhook da Asaas, que não tem sessão de usuário
 * (é o servidor da Asaas chamando o nosso, não um dono de barbearia logado).
 * Nunca importar isto em código que roda no navegador. Criado sob demanda
 * (não no carregamento do módulo) para não quebrar o build antes das env
 * vars existirem.
 */
export function getSupabaseAdmin() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY precisam estar definidas em .env.local");
  }

  client = createClient(supabaseUrl, secretKey);
  return client;
}
