"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, UserX, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { VipClientsTable, type VipClientRow } from "@/components/dashboard/vip-clients-table";
import { useAppointments } from "@/lib/data/appointments";
import { useClients } from "@/lib/data/clients";
import { useExpenses } from "@/lib/data/expenses";
import { addMonths, currentMonthKey, formatCurrencyBRL, formatMonthLabelPT, monthKeyOf } from "@/lib/utils";

export default function DashboardPage() {
  const appointments = useAppointments();
  const clients = useClients();
  const expenses = useExpenses();
  const [month, setMonth] = useState(currentMonthKey());

  const { grossRevenue, netProfit, faultRate, vipRows } = useMemo(() => {
    const monthAppointments = appointments.filter((appointment) => monthKeyOf(appointment.date) === month);
    const monthExpenses = expenses.filter((expense) => monthKeyOf(expense.date) === month);

    const grossRevenue = monthAppointments
      .filter((appointment) => appointment.paymentStatus === "PAID")
      .reduce((total, appointment) => total + appointment.price, 0);

    const totalExpenses = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
    const netProfit = grossRevenue - totalExpenses;

    const canceledCount = monthAppointments.filter((appointment) => appointment.status === "CANCELED").length;
    const faultRate = monthAppointments.length > 0 ? (canceledCount / monthAppointments.length) * 100 : 0;

    const revenueByClient = new Map<string, { visits: number; revenue: number }>();
    for (const appointment of monthAppointments) {
      if (appointment.status !== "COMPLETED") continue;
      const current = revenueByClient.get(appointment.clientId) ?? { visits: 0, revenue: 0 };
      current.visits += 1;
      current.revenue += appointment.price;
      revenueByClient.set(appointment.clientId, current);
    }

    const vipRows: VipClientRow[] = Array.from(revenueByClient.entries())
      .map(([clientId, stats]) => ({
        clientId,
        name: clients.find((client) => client.id === clientId)?.name ?? "Cliente removido",
        visits: stats.visits,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.visits - a.visits || b.revenue - a.revenue)
      .slice(0, 5);

    return { grossRevenue, netProfit, faultRate, vipRows };
  }, [appointments, clients, expenses, month]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard icon={Wallet} label="Faturamento bruto" value={formatCurrencyBRL(grossRevenue)} caption="Agendamentos pagos no mês" />
        <KpiCard
          icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          label="Lucro líquido"
          value={formatCurrencyBRL(netProfit)}
          tone={netProfit >= 0 ? "positive" : "negative"}
          caption="Faturamento − despesas"
        />
        <KpiCard
          icon={UserX}
          label="Taxa de faltas"
          value={`${faultRate.toFixed(0)}%`}
          tone={faultRate > 20 ? "negative" : "default"}
          caption="Agendamentos cancelados no mês"
        />
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Clientes VIP do mês</h2>
        <VipClientsTable rows={vipRows} />
      </section>
    </div>
  );
}
