"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PendingPayments } from "@/components/finance/pending-payments";
import { ExpenseFormModal } from "@/components/finance/expense-form-modal";
import { ExpenseList } from "@/components/finance/expense-list";
import { deleteExpense, useExpenses } from "@/lib/data/expenses";
import type { Expense } from "@/lib/types";

export default function FinanceiroPage() {
  const expenses = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Expense | undefined>(undefined);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
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
        onConfirm={() => {
          if (deleting) {
            deleteExpense(deleting.id);
            toast.success("Despesa excluída.");
          }
        }}
      />
    </div>
  );
}
