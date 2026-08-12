import { create } from "zustand";
import type { Appointment, Client, Expense, Service } from "@/lib/types";

interface AppState {
  hydrated: boolean;
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  expenses: Expense[];

  setAll: (data: {
    clients: Client[];
    services: Service[];
    appointments: Appointment[];
    expenses: Expense[];
  }) => void;

  addClient: (client: Client) => void;
  replaceClient: (id: string, client: Client) => void;
  removeClientLocal: (id: string) => void;

  addService: (service: Service) => void;
  replaceService: (id: string, service: Service) => void;
  removeServiceLocal: (id: string) => void;

  addAppointment: (appointment: Appointment) => void;
  replaceAppointment: (id: string, appointment: Appointment) => void;
  removeAppointmentLocal: (id: string) => void;

  addExpense: (expense: Expense) => void;
  removeExpenseLocal: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hydrated: false,
  clients: [],
  services: [],
  appointments: [],
  expenses: [],

  setAll: (data) => set({ ...data, hydrated: true }),

  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  replaceClient: (id, client) =>
    set((state) => ({ clients: state.clients.map((c) => (c.id === id ? client : c)) })),
  removeClientLocal: (id) =>
    set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),

  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  replaceService: (id, service) =>
    set((state) => ({ services: state.services.map((s) => (s.id === id ? service : s)) })),
  removeServiceLocal: (id) =>
    set((state) => ({ services: state.services.filter((s) => s.id !== id) })),

  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  replaceAppointment: (id, appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? appointment : a)),
    })),
  removeAppointmentLocal: (id) =>
    set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) })),

  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  removeExpenseLocal: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
}));
