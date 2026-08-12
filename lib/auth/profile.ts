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
    .select(
      "shop_name, pix_key, cpf_cnpj, subscription_status, trial_ends_at, slug, business_hours_start, business_hours_end"
    )
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
    slug: data?.slug ?? null,
    businessHoursStart: data?.business_hours_start?.slice(0, 5) ?? "09:00",
    businessHoursEnd: data?.business_hours_end?.slice(0, 5) ?? "19:00",
  });
}

export async function updateShopName(shopName: string) {
  const { userId, slug } = useAuthStore.getState();
  if (!userId) return;

  const updates: { shop_name: string; slug?: string } = { shop_name: shopName };

  // Contas via Google preenchem o nome só no onboarding, depois do cadastro
  // — ainda não têm slug nesse ponto. Gera reaproveitando a mesma função
  // usada no trigger de cadastro (evita duplicar a lógica de slugify).
  if (!slug) {
    const { data: generatedSlug } = await supabase.rpc("generate_slug", { input_name: shopName });
    if (generatedSlug) updates.slug = generatedSlug;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;

  useAuthStore.getState().setShopName(shopName);
  if (updates.slug) useAuthStore.getState().setSlug(updates.slug);
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

export async function updateSlug(slug: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase.from("profiles").update({ slug }).eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setSlug(slug);
}

export async function updateBusinessHours(start: string, end: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase
    .from("profiles")
    .update({ business_hours_start: start, business_hours_end: end })
    .eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setBusinessHours(start, end);
}
