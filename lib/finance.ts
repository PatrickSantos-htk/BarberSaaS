import type { Appointment, Expense } from "@/lib/types";

export interface MonthStats {
  grossRevenue: number;
  netProfit: number;
  faultRate: number;
  avgTicket: number;
}

export function monthStats(monthAppointments: Appointment[], monthExpenses: Expense[]): MonthStats {
  const paid = monthAppointments.filter((a) => a.paymentStatus === "PAID");
  const grossRevenue = paid.reduce((total, a) => total + a.price, 0);
  const netProfit = grossRevenue - monthExpenses.reduce((total, e) => total + e.amount, 0);
  const canceledCount = monthAppointments.filter((a) => a.status === "CANCELED").length;
  const faultRate = monthAppointments.length > 0 ? (canceledCount / monthAppointments.length) * 100 : 0;
  const avgTicket = paid.length > 0 ? grossRevenue / paid.length : 0;
  return { grossRevenue, netProfit, faultRate, avgTicket };
}

export function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export interface MonthlyPoint {
  month: string;
  grossRevenue: number;
  totalExpenses: number;
  netProfit: number;
  clientsServed: number;
}

export function monthlySeries(
  monthKeys: string[],
  appointments: Appointment[],
  expenses: Expense[]
): MonthlyPoint[] {
  return monthKeys.map((month) => {
    const monthAppointments = appointments.filter((a) => a.date.slice(0, 7) === month);
    const monthExpenses = expenses.filter((e) => e.date.slice(0, 7) === month);
    const { grossRevenue, netProfit } = monthStats(monthAppointments, monthExpenses);
    const totalExpenses = monthExpenses.reduce((total, e) => total + e.amount, 0);
    const clientsServed = new Set(
      monthAppointments.filter((a) => a.status !== "CANCELED").map((a) => a.clientId)
    ).size;
    return { month, grossRevenue, totalExpenses, netProfit, clientsServed };
  });
}
