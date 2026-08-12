"use client";

import { useState } from "react";
import { MessageCircle, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmPaymentModal } from "@/components/agenda/confirm-payment-modal";
import { useAppointments } from "@/lib/data/appointments";
import { useClient } from "@/lib/data/clients";
import { useService } from "@/lib/data/services";
import { useAuthStore } from "@/lib/auth/store";
import { buildPaymentChargeMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import type { Appointment } from "@/lib/types";
import { cn, formatCurrencyBRL, formatDateBR, todayISO } from "@/lib/utils";

function PendingPaymentRow({ appointment }: { appointment: Appointment }) {
  const client = useClient(appointment.clientId);
  const service = useService(appointment.serviceId);
  const pixKey = useAuthStore((state) => state.pixKey);
  const [open, setOpen] = useState(false);
  const today = todayISO();

  const isOverdue = Boolean(appointment.paymentDueDate && appointment.paymentDueDate < today);
  const isDueToday = appointment.paymentDueDate === today;

  const whatsappLink = buildWhatsAppLink(
    client?.phone ?? "",
    buildPaymentChargeMessage({
      clientName: client?.name ?? "cliente",
      serviceName: service?.name ?? "serviço",
      price: appointment.price,
      pixKey,
    })
  );

  return (
    <li className="flex flex-wrap items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base text-foreground">{client?.name ?? "Cliente removido"}</p>
        <p className="truncate text-xs text-muted">
          {formatDateBR(appointment.date)} às {appointment.time} · {service?.name ?? "—"}
        </p>
        {appointment.paymentDueDate ? (
          <p
            className={cn(
              "mt-0.5 text-xs font-medium",
              isOverdue ? "text-status-canceled" : isDueToday ? "text-status-pending" : "text-muted-foreground"
            )}
          >
            {isOverdue ? "Venceu em" : "Vence em"} {formatDateBR(appointment.paymentDueDate)}
          </p>
        ) : null}
      </div>
      <p className="shrink-0 font-display text-base text-accent">{formatCurrencyBRL(appointment.price)}</p>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        <MessageCircle className="h-4 w-4" />
        Cobrar
      </a>
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
