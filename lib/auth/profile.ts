import { supabase } from "@/lib/supabase/client";
import { useAuthStore, type SubscriptionStatus } from "@/lib/auth/store";

export async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    useAuthStore.getState().clear();
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("shop_name, pix_key, cpf_cnpj, subscription_status, trial_ends_at")
    .eq("id", user.id)
    .single();
  if (error) throw error;

  useAuthStore.getState().setProfile({
    userId: user.id,
    email: user.email ?? "",
    shopName: data?.shop_name ?? null,
    pixKey: data?.pix_key ?? null,
    cpfCnpj: data?.cpf_cnpj ?? null,
    subscriptionStatus: (data?.subscription_status as SubscriptionStatus) ?? "trial",
    trialEndsAt: data?.trial_ends_at ?? null,
  });
}

export async function updateShopName(shopName: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase.from("profiles").update({ shop_name: shopName }).eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setShopName(shopName);
}

export async function updatePixKey(pixKey: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase.from("profiles").update({ pix_key: pixKey }).eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setPixKey(pixKey);
}

export async function updateCpfCnpj(cpfCnpj: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase.from("profiles").update({ cpf_cnpj: cpfCnpj }).eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setCpfCnpj(cpfCnpj);
}
