"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Receipt, TrendingDown, TrendingUp, UserX, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TodaySummary } from "@/components/dashboard/today-summary";
import { DuePaymentsBanner } from "@/components/dashboard/due-payments-banner";
import { TopServices, type TopServiceRow } from "@/components/dashboard/top-services";
import { VipClientsTable, type VipClientRow } from "@/components/dashboard/vip-clients-table";
import { useAppointments, useAppointmentsByDate } from "@/lib/data/appointments";
import { useClients } from "@/lib/data/clients";
import { useExpenses } from "@/lib/data/expenses";
import { useServices } from "@/lib/data/services";
import type { Appointment, Expense } from "@/lib/types";
import { addMonths, currentMonthKey, formatCurrencyBRL, formatMonthLabelPT, monthKeyOf, todayISO } from "@/lib/utils";

function monthStats(monthAppointments: Appointment[], monthExpenses: Expense[]) {
  const paid = monthAppointments.filter((a) => a.paymentStatus === "PAID");
  const grossRevenue = paid.reduce((total, a) => total + a.price, 0);
  const netProfit = grossRevenue - monthExpenses.reduce((total, e) => total + e.amount, 0);
  const canceledCount = monthAppointments.filter((a) => a.status === "CANCELED").length;
  const faultRate = monthAppointments.length > 0 ? (canceledCount / monthAppointments.length) * 100 : 0;
  const avgTicket = paid.length > 0 ? grossRevenue / paid.length : 0;
  return { grossRevenue, netProfit, faultRate, avgTicket };
}

function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default function DashboardPage() {
  const appointments = useAppointments();
  const clients = useClients();
  const services = useServices();
  const expenses = useExpenses();
  const [month, setMonth] = useState(currentMonthKey());

  const today = todayISO();
  const todayAppointments = useAppointmentsByDate(today);

  const { current, previous, vipRows, topServiceRows } = useMemo(() => {
    const previousMonth = addMonths(month, -1);
    const monthAppointments = appointments.filter((a) => monthKeyOf(a.date) === month);
    const prevMonthAppointments = appointments.filter((a) => monthKeyOf(a.date) === previousMonth);
    const monthExpenses = expenses.filter((e) => monthKeyOf(e.date) === month);
    const prevMonthExpenses = expenses.filter((e) => monthKeyOf(e.date) === previousMonth);

    const current = monthStats(monthAppointments, monthExpenses);
    const previous = monthStats(prevMonthAppointments, prevMonthExpenses);

    const revenueByClient = new Map<string, { visits: number; revenue: number }>();
    const revenueByService = new Map<string, { count: number; revenue: number }>();
    for (const appointment of monthAppointments) {
      if (appointment.status !== "COMPLETED") continue;

      const client = revenueByClient.get(appointment.clientId) ?? { visits: 0, revenue: 0 };
      client.visits += 1;
      client.revenue += appointment.price;
      revenueByClient.set(appointment.clientId, client);

      const service = revenueByService.get(appointment.serviceId) ?? { count: 0, revenue: 0 };
      service.count += 1;
      service.revenue += appointment.price;
      revenueByService.set(appointment.serviceId, service);
    }

    const vipRows: VipClientRow[] = Array.from(revenueByClient.entries())
      .map(([clientId, stats]) => ({
        clientId,
        name: clients.find((c) => c.id === clientId)?.name ?? "Cliente removido",
        visits: stats.visits,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.visits - a.visits || b.revenue - a.revenue)
      .slice(0, 5);

    const topServiceRows: TopServiceRow[] = Array.from(revenueByService.entries())
      .map(([serviceId, stats]) => ({
        serviceId,
        name: services.find((s) => s.id === serviceId)?.name ?? "Serviço removido",
        count: stats.count,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { current, previous, vipRows, topServiceRows };
  }, [appointments, clients, services, expenses, month]);

  const revenueDelta = deltaPct(current.grossRevenue, previous.grossRevenue);
  const profitDelta = deltaPct(current.netProfit, previous.netProfit);
  const faultDelta = deltaPct(current.faultRate, previous.faultRate);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <DuePaymentsBanner />
      <TodaySummary appointments={todayAppointments} clients={clients} services={services} />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Mês anterior" onClick={() => setMonth((current) => addMonths(current, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Próximo mês" onClick={() => setMonth((current) => addMonths(current, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="font-display text-lg capitalize text-foreground">{formatMonthLabelPT(month)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Faturamento bruto"
          value={formatCurrencyBRL(current.grossRevenue)}
          caption="Agendamentos pagos no mês"
          delta={revenueDelta === null ? undefined : { pct: revenueDelta, goodDirection: "up" }}
        />
        <KpiCard
          icon={current.netProfit >= 0 ? TrendingUp : TrendingDown}
          label="Lucro líquido"
          value={formatCurrencyBRL(current.netProfit)}
          tone={current.netProfit >= 0 ? "positive" : "negative"}
          caption="Faturamento − despesas"
          delta={profitDelta === null ? undefined : { pct: profitDelta, goodDirection: "up" }}
        />
        <KpiCard
          icon={Receipt}
          label="Ticket médio"
          value={formatCurrencyBRL(current.avgTicket)}
          caption="Por agendamento pago"
        />
        <KpiCard
          icon={UserX}
          label="Taxa de faltas"
          value={`${current.faultRate.toFixed(0)}%`}
          tone={current.faultRate > 20 ? "negative" : "default"}
          caption="Agendamentos cancelados no mês"
          delta={faultDelta === null ? undefined : { pct: faultDelta, goodDirection: "down" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-display text-lg text-foreground">Serviços mais vendidos</h2>
          <TopServices rows={topServiceRows} />
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-lg text-foreground">Clientes VIP do mês</h2>
          <VipClientsTable rows={vipRows} />
        </section>
      </div>
    </div>
  );
}
