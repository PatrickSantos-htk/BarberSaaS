import { create } from "zustand";

interface AuthState {
  loaded: boolean;
  userId: string | null;
  email: string | null;
  shopName: string | null;
  setProfile: (profile: { userId: string; email: string; shopName: string | null }) => void;
  setShopName: (shopName: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loaded: false,
  userId: null,
  email: null,
  shopName: null,
  setProfile: (profile) => set({ ...profile, loaded: true }),
  setShopName: (shopName) => set({ shopName }),
  clear: () => set({ loaded: false, userId: null, email: null, shopName: null }),
}));
