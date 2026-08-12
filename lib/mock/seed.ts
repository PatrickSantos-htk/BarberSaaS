import type { Appointment, Client, Expense, Service } from "@/lib/types";
import { addDays, toISODate } from "@/lib/utils";

const today = toISODate(new Date());

export const seedServices: Service[] = [
  { id: "svc-1", name: "Corte Simples", price: 40, durationMinutes: 30 },
  { id: "svc-2", name: "Barba", price: 30, durationMinutes: 20 },
  { id: "svc-3", name: "Combo Corte + Barba", price: 60, durationMinutes: 50 },
];

export const seedClients: Client[] = [
  { id: "cli-1", name: "João Silva", phone: "(11) 98765-4321", email: "joao.silva@email.com", createdAt: today },
  { id: "cli-2", name: "Marcos Lima", phone: "(11) 91234-5678", email: "marcos.lima@email.com", createdAt: today },
  { id: "cli-3", name: "Pedro Costa", phone: "(11) 99876-1234", email: "pedro.costa@email.com", createdAt: today },
  { id: "cli-4", name: "Rafael Souza", phone: "(11) 98888-2222", email: "rafael.souza@email.com", createdAt: today },
  { id: "cli-5", name: "Lucas Fernandes", phone: "(11) 97777-3333", email: "lucas.fernandes@email.com", createdAt: today },
];

export const seedAppointments: Appointment[] = [
  { id: "apt-1", clientId: "cli-1", serviceId: "svc-3", date: today, time: "09:00", price: 60, status: "PENDING", paymentStatus: "UNPAID", paymentMethod: null },
  { id: "apt-2", clientId: "cli-2", serviceId: "svc-1", date: today, time: "10:30", price: 40, status: "CONFIRMED", paymentStatus: "UNPAID", paymentMethod: null },
  { id: "apt-3", clientId: "cli-3", serviceId: "svc-2", date: today, time: "13:00", price: 30, status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "PIX" },
  { id: "apt-4", clientId: "cli-4", serviceId: "svc-3", date: today, time: "15:30", price: 60, status: "CANCELED", paymentStatus: "UNPAID", paymentMethod: null },
  { id: "apt-5", clientId: "cli-1", serviceId: "svc-1", date: addDays(today, 1), time: "09:00", price: 40, status: "PENDING", paymentStatus: "UNPAID", paymentMethod: null },
  { id: "apt-6", clientId: "cli-5", serviceId: "svc-3", date: addDays(today, 1), time: "11:00", price: 60, status: "CONFIRMED", paymentStatus: "UNPAID", paymentMethod: null },
  { id: "apt-7", clientId: "cli-2", serviceId: "svc-2", date: addDays(today, -1), time: "14:00", price: 30, status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "DINHEIRO" },
  { id: "apt-8", clientId: "cli-3", serviceId: "svc-3", date: addDays(today, -1), time: "16:00", price: 60, status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "CARTAO" },
  { id: "apt-9", clientId: "cli-1", serviceId: "svc-3", date: addDays(today, -3), time: "10:00", price: 60, status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "PIX" },
  { id: "apt-10", clientId: "cli-1", serviceId: "svc-1", date: addDays(today, -6), time: "09:30", price: 40, status: "COMPLETED", paymentStatus: "PAID", paymentMethod: "PIX" },
  { id: "apt-11", clientId: "cli-4", serviceId: "svc-2", date: addDays(today, 2), time: "17:00", price: 30, status: "PENDING", paymentStatus: "UNPAID", paymentMethod: null },
];

export const seedExpenses: Expense[] = [
  { id: "exp-1", description: "Aluguel do salão", category: "Aluguel", amount: 1800, date: addDays(today, -5) },
  { id: "exp-2", description: "Conta de água e luz", category: "Água e Luz", amount: 320, date: addDays(today, -4) },
  { id: "exp-3", description: "Pomadas e produtos de barba", category: "Produtos e Pomadas", amount: 240, date: addDays(today, -2) },
];
