"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { markAppointmentPaid } from "@/lib/data/appointments";
import { PAYMENT_METHOD_LABEL, type Appointment, type PaymentMethod } from "@/lib/types";
import { cn, formatCurrencyBRL } from "@/lib/utils";

const METHODS: PaymentMethod[] = ["PIX", "CARTAO", "DINHEIRO"];

interface ConfirmPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
}

function ConfirmPaymentModal({ open, onOpenChange, appointment }: ConfirmPaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("PIX");

  function handleConfirm() {
    markAppointmentPaid(appointment.id, method);
    toast.success(`Pagamento de ${formatCurrencyBRL(appointment.price)} confirmado via ${PAYMENT_METHOD_LABEL[method]}.`);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title="Confirmar pagamento"
        description={`Valor: ${formatCurrencyBRL(appointment.price)}`}
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              Método de pagamento
            </p>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMethod(option)}
                  className={cn(
                    "rounded-sm border px-3 py-2 text-sm font-medium transition-colors",
                    method === option
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-strong text-muted hover:text-foreground"
                  )}
                >
                  {PAYMENT_METHOD_LABEL[option]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar pagamento</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmPaymentModal };
