export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
export type PaymentStatus = "UNPAID" | "PAID";
export type PaymentMethod = "PIX" | "CARTAO" | "DINHEIRO";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO date, e.g. 2026-08-12
  time: string; // HH:mm
  price: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paymentDueDate: string | null;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: "Em aberto",
  PAID: "Pago",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
};

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Água e Luz",
  "Produtos e Pomadas",
  "Equipamentos",
  "Marketing",
  "Outros",
] as const;
