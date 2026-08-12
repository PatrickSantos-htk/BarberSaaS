"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense } from "@/lib/data/expenses";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { todayISO } from "@/lib/utils";

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ExpenseFormModal({ open, onOpenChange }: ExpenseFormModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDescription("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setAmount("");
      setDate(todayISO());
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const amountValue = Number(amount.replace(",", "."));

    if (!description.trim()) return setError("Descreva a despesa.");
    if (!amountValue || amountValue <= 0) return setError("Informe um valor válido.");

    setError("");
    setSubmitting(true);
    try {
      await createExpense({ description: description.trim(), category, amount: amountValue, date });
      toast.success("Despesa lançada.");
      onOpenChange(false);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title="Nova despesa" description="Registre saídas como aluguel, contas e produtos.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="expense-description">Descrição</Label>
            <Input
              id="expense-description"
              placeholder="Ex: Conta de luz"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expense-category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="expense-category" aria-label="Selecionar categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense-amount">Valor (R$)</Label>
              <Input
                id="expense-amount"
                inputMode="decimal"
                placeholder="150"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expense-date">Data</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-status-canceled">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando…" : "Lançar despesa"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { ExpenseFormModal };
