import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/auth/store";

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
    .select("shop_name")
    .eq("id", user.id)
    .single();
  if (error) throw error;

  useAuthStore.getState().setProfile({
    userId: user.id,
    email: user.email ?? "",
    shopName: data?.shop_name ?? null,
  });
}

export async function updateShopName(shopName: string) {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  const { error } = await supabase.from("profiles").update({ shop_name: shopName }).eq("id", userId);
  if (error) throw error;
  useAuthStore.getState().setShopName(shopName);
}
