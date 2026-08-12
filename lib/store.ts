import { create } from "zustand";
import type {
  Appointment,
  AppointmentStatus,
  Client,
  Expense,
  PaymentMethod,
  Service,
} from "@/lib/types";
import { seedAppointments, seedClients, seedExpenses, seedServices } from "@/lib/mock/seed";

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface AppState {
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  expenses: Expense[];

  addClient: (input: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, input: Omit<Client, "id" | "createdAt">) => void;
  removeClient: (id: string) => void;

  addService: (input: Omit<Service, "id">) => void;
  updateService: (id: string, input: Omit<Service, "id">) => void;
  removeService: (id: string) => void;

  addAppointment: (input: Omit<Appointment, "id" | "status" | "paymentStatus" | "paymentMethod">) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  markAppointmentPaid: (id: string, method: PaymentMethod) => void;

  addExpense: (input: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  clients: seedClients,
  services: seedServices,
  appointments: seedAppointments,
  expenses: seedExpenses,

  addClient: (input) =>
    set((state) => ({
      clients: [
        ...state.clients,
        { ...input, id: generateId("cli"), createdAt: new Date().toISOString().slice(0, 10) },
      ],
    })),
  updateClient: (id, input) =>
    set((state) => ({
      clients: state.clients.map((client) => (client.id === id ? { ...client, ...input } : client)),
    })),
  removeClient: (id) =>
    set((state) => ({ clients: state.clients.filter((client) => client.id !== id) })),

  addService: (input) =>
    set((state) => ({ services: [...state.services, { ...input, id: generateId("svc") }] })),
  updateService: (id, input) =>
    set((state) => ({
      services: state.services.map((service) => (service.id === id ? { ...service, ...input } : service)),
    })),
  removeService: (id) =>
    set((state) => ({ services: state.services.filter((service) => service.id !== id) })),

  addAppointment: (input) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        { ...input, id: generateId("apt"), status: "PENDING", paymentStatus: "UNPAID", paymentMethod: null },
      ],
    })),
  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      ),
    })),
  markAppointmentPaid: (id, method) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, paymentStatus: "PAID", paymentMethod: method }
          : appointment
      ),
    })),

  addExpense: (input) =>
    set((state) => ({ expenses: [...state.expenses, { ...input, id: generateId("exp") }] })),
  removeExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((expense) => expense.id !== id) })),
}));
