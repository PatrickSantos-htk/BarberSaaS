import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/auth/store";

/** Returns `{ confirmedImmediately: false }` when the project requires e-mail
 * confirmation — there's no active session yet, so the caller must not
 * redirect into the (dashboard) routes (the proxy would just bounce back). */
export async function signUpWithPassword(input: { shopName: string; email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { shop_name: input.shopName } },
  });
  if (error) throw error;
  return { confirmedImmediately: Boolean(data.session) };
}

export async function signInWithPassword(input: { email: string; password: string }) {
  const { error } = await supabase.auth.signInWithPassword(input);
  if (error) throw error;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  useAuthStore.getState().clear();
}
