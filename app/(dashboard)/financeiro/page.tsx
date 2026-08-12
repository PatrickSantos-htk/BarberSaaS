"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Receipt, TrendingDown, TrendingUp, UserX, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PendingPayments } from "@/components/finance/pending-payments";
import { ExpenseFormModal } from "@/components/finance/expense-form-modal";
import { ExpenseList } from "@/components/finance/expense-list";
import { MonthlyTrendChart } from "@/components/finance/monthly-trend-chart";
import { useAppointments } from "@/lib/data/appointments";
import { deleteExpense, useExpenses } from "@/lib/data/expenses";
import { deltaPct, monthlySeries, monthStats } from "@/lib/finance";
import type { Expense } from "@/lib/types";
import { addMonths, currentMonthKey, formatCurrencyBRL, formatMonthLabelPT, monthKeyOf } from "@/lib/utils";

export default function FinanceiroPage() {
  const appointments = useAppointments();
  const expenses = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Expense | undefined>(undefined);
  const [month, setMonth] = useState(currentMonthKey());

  const { current, revenueDelta, profitDelta, faultDelta } = useMemo(() => {
    const previousMonth = addMonths(month, -1);
    const current = monthStats(
      appointments.filter((a) => monthKeyOf(a.date) === month),
      expenses.filter((e) => monthKeyOf(e.date) === month)
    );
    const previous = monthStats(
      appointments.filter((a) => monthKeyOf(a.date) === previousMonth),
      expenses.filter((e) => monthKeyOf(e.date) === previousMonth)
    );
    return {
      current,
      revenueDelta: deltaPct(current.grossRevenue, previous.grossRevenue),
      profitDelta: deltaPct(current.netProfit, previous.netProfit),
      faultDelta: deltaPct(current.faultRate, previous.faultRate),
    };
  }, [appointments, expenses, month]);

  const trend = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => addMonths(month, i - 5));
    return monthlySeries(months, appointments, expenses);
  }, [appointments, expenses, month]);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Mês anterior" onClick={() => setMonth((m) => addMonths(m, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Próximo mês" onClick={() => setMonth((m) => addMonths(m, 1))}>
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
      </section>

      <section className="panel space-y-4 p-4">
        <div className="space-y-1">
          <h2 className="font-display text-lg text-foreground">Evolução mensal</h2>
          <p className="text-sm text-muted">
            Faturamento, despesas e clientes atendidos nos últimos 6 meses.
          </p>
        </div>
        <MonthlyTrendChart data={trend} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Pagamentos pendentes</h2>
        <PendingPayments />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg text-foreground">Despesas</h2>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova despesa
          </Button>
        </div>

        {expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma despesa lançada"
            description="Registre custos como aluguel, contas e produtos para acompanhar o lucro líquido."
          />
        ) : (
          <ExpenseList expenses={expenses} onDelete={setDeleting} />
        )}
      </section>

      <ExpenseFormModal open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir despesa?"
        confirmLabel="Excluir"
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteExpense(deleting.id);
            toast.success("Despesa excluída.");
          } catch {
            toast.error("Não foi possível excluir a despesa.");
          }
        }}
      />
    </div>
  );
}
