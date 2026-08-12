"use client";

import { useEffect, type ReactNode } from "react";
import { loadProfile } from "@/lib/auth/profile";
import { useAuthStore } from "@/lib/auth/store";
import { ShopNameModal } from "@/components/onboarding/shop-name-modal";

function AuthProvider({ children }: { children: ReactNode }) {
  const loaded = useAuthStore((state) => state.loaded);
  const shopName = useAuthStore((state) => state.shopName);

  useEffect(() => {
    loadProfile().catch(() => {});
  }, []);

  return (
    <>
      {children}
      {loaded && !shopName ? <ShopNameModal /> : null}
    </>
  );
}

export { AuthProvider };
