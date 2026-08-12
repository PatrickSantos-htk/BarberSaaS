import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { Expense } from "@/lib/types";

interface ExpenseRow {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
}

function mapRow(row: ExpenseRow): Expense {
  return { id: row.id, description: row.description, category: row.category, amount: Number(row.amount), date: row.date };
}

export function useExpenses() {
  return useAppStore((state) => state.expenses);
}

export async function fetchExpenses() {
  const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false });
  if (error) throw error;
  return (data as ExpenseRow[]).map(mapRow);
}

export async function createExpense(input: Omit<Expense, "id">) {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      description: input.description,
      category: input.category,
      amount: input.amount,
      date: input.date,
    })
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().addExpense(mapRow(data as ExpenseRow));
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
  useAppStore.getState().removeExpenseLocal(id);
}
