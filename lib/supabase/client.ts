import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Criado sob demanda (não no carregamento do módulo) para não quebrar a
 * pré-renderização estática de páginas "use client" quando as env vars
 * ainda não estão configuradas na plataforma de deploy.
 */
function getSupabaseBrowserClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY precisam estar definidas."
    );
  }

  client = createBrowserClient(supabaseUrl, supabasePublishableKey);
  return client;
}

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseBrowserClient(), prop, receiver);
  },
});
