"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmPaymentModal } from "@/components/agenda/confirm-payment-modal";
import { useAppointments } from "@/lib/data/appointments";
import { useClient } from "@/lib/data/clients";
import { useService } from "@/lib/data/services";
import type { Appointment } from "@/lib/types";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";

function PendingPaymentRow({ appointment }: { appointment: Appointment }) {
  const client = useClient(appointment.clientId);
  const service = useService(appointment.serviceId);
  const [open, setOpen] = useState(false);

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base text-foreground">{client?.name ?? "Cliente removido"}</p>
        <p className="truncate text-xs text-muted">
          {formatDateBR(appointment.date)} às {appointment.time} · {service?.name ?? "—"}
        </p>
      </div>
      <p className="shrink-0 font-display text-base text-accent">{formatCurrencyBRL(appointment.price)}</p>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Wallet className="h-4 w-4" />
        Confirmar
      </Button>
      <ConfirmPaymentModal open={open} onOpenChange={setOpen} appointment={appointment} />
    </li>
  );
}

function PendingPayments() {
  const appointments = useAppointments();
  const pending = appointments
    .filter((appointment) => appointment.paymentStatus === "UNPAID" && appointment.status !== "CANCELED")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (pending.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="Nenhum pagamento em aberto"
        description="Os agendamentos com pagamento pendente aparecem aqui."
      />
    );
  }

  return (
    <ul className="panel divide-y divide-border">
      {pending.map((appointment) => (
        <PendingPaymentRow key={appointment.id} appointment={appointment} />
      ))}
    </ul>
  );
}

export { PendingPayments };
