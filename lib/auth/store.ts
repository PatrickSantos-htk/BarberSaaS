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
  slug: string | null;
  businessHoursStart: string;
  businessHoursEnd: string;
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
  setSlug: (slug: string) => void;
  setBusinessHours: (start: string, end: string) => void;
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
  slug: null,
  businessHoursStart: "09:00",
  businessHoursEnd: "19:00",
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setProfile: (profile) => set({ ...profile, loaded: true }),
  setShopName: (shopName) => set({ shopName }),
  setPixKey: (pixKey) => set({ pixKey }),
  setCpfCnpj: (cpfCnpj) => set({ cpfCnpj }),
  setSubscriptionStatus: (subscriptionStatus) => set({ subscriptionStatus }),
  setSlug: (slug) => set({ slug }),
  setBusinessHours: (businessHoursStart, businessHoursEnd) =>
    set({ businessHoursStart, businessHoursEnd }),
  clear: () => set(initialState),
}));
