import { create } from "zustand";

export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

interface Profile {
  userId: string;
  email: string;
  shopName: string | null;
  pixKey: string | null;
  cpfCnpj: string | null;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
}

interface AuthState extends Omit<Profile, "userId" | "email"> {
  loaded: boolean;
  userId: string | null;
  email: string | null;
  setProfile: (profile: Profile) => void;
  setShopName: (shopName: string) => void;
  setPixKey: (pixKey: string) => void;
  setCpfCnpj: (cpfCnpj: string) => void;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
  clear: () => void;
}

const initialState = {
  loaded: false,
  userId: null,
  email: null,
  shopName: null,
  pixKey: null,
  cpfCnpj: null,
  subscriptionStatus: "trial" as SubscriptionStatus,
  trialEndsAt: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setProfile: (profile) => set({ ...profile, loaded: true }),
  setShopName: (shopName) => set({ shopName }),
  setPixKey: (pixKey) => set({ pixKey }),
  setCpfCnpj: (cpfCnpj) => set({ cpfCnpj }),
  setSubscriptionStatus: (subscriptionStatus) => set({ subscriptionStatus }),
  clear: () => set(initialState),
}));
