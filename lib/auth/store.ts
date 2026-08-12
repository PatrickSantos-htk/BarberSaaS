import { create } from "zustand";

interface AuthState {
  loaded: boolean;
  userId: string | null;
  email: string | null;
  shopName: string | null;
  pixKey: string | null;
  setProfile: (profile: { userId: string; email: string; shopName: string | null; pixKey: string | null }) => void;
  setShopName: (shopName: string) => void;
  setPixKey: (pixKey: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loaded: false,
  userId: null,
  email: null,
  shopName: null,
  pixKey: null,
  setProfile: (profile) => set({ ...profile, loaded: true }),
  setShopName: (shopName) => set({ shopName }),
  setPixKey: (pixKey) => set({ pixKey }),
  clear: () => set({ loaded: false, userId: null, email: null, shopName: null, pixKey: null }),
}));
