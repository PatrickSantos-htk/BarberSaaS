"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/lib/types";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
}

function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const sorted = expenses.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="divide-y divide-border rounded-md border border-border bg-surface">
      {sorted.map((expense) => (
        <li key={expense.id} className="flex items-center gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base text-foreground">{expense.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="neutral">{expense.category}</Badge>
              <span className="text-xs text-muted">{formatDateBR(expense.date)}</span>
            </div>
          </div>
          <p className="shrink-0 font-display text-base text-status-canceled">
            − {formatCurrencyBRL(expense.amount)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Excluir despesa ${expense.description}`}
            onClick={() => onDelete(expense)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

export { ExpenseList };
