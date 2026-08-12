import { useAppStore } from "@/lib/store";
import type { Expense } from "@/lib/types";

export function useExpenses() {
  return useAppStore((state) => state.expenses);
}

export function createExpense(input: Omit<Expense, "id">) {
  useAppStore.getState().addExpense(input);
}

export function deleteExpense(id: string) {
  useAppStore.getState().removeExpense(id);
}
