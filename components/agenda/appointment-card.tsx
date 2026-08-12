"use client";

import { useState } from "react";
import { MessageCircle, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/agenda/status-badge";
import { ConfirmPaymentModal } from "@/components/agenda/confirm-payment-modal";
import { useClient } from "@/lib/data/clients";
import { useService } from "@/lib/data/services";
import { updateAppointmentStatus } from "@/lib/data/appointments";
import type { Appointment } from "@/lib/types";
import { cn, formatCurrencyBRL } from "@/lib/utils";

const STATUS_ACCENT: Record<Appointment["status"], string> = {
  PENDING: "border-l-status-pending",
  CONFIRMED: "border-l-status-confirmed",
  COMPLETED: "border-l-status-completed",
  CANCELED: "border-l-status-canceled",
};

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const client = useClient(appointment.clientId);
  const service = useService(appointment.serviceId);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  function handleRequestPayment() {
    toast.message("Envio pelo WhatsApp em breve", {
      description: "Essa ação será conectada na Fase 4 (integração com WhatsApp).",
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border border-l-4 bg-surface p-4 sm:flex-row sm:items-center",
        STATUS_ACCENT[appointment.status]
      )}
    >
      <div className="w-16 shrink-0">
        <p className="font-display text-xl text-foreground">{appointment.time}</p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base text-foreground">
          {client?.name ?? "Cliente removido"}
        </p>
        <p className="truncate text-sm text-muted">
          {service?.name ?? "Serviço removido"} · {formatCurrencyBRL(appointment.price)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <AppointmentStatusBadge status={appointment.status} />
          <PaymentStatusBadge status={appointment.paymentStatus} />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {appointment.status === "PENDING" && (
          <>
            <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(appointment.id, "CONFIRMED")}>
              Confirmar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(appointment.id, "CANCELED")}>
              Cancelar
            </Button>
          </>
        )}
        {appointment.status === "CONFIRMED" && (
          <>
            <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(appointment.id, "COMPLETED")}>
              Concluir
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(appointment.id, "CANCELED")}>
              Cancelar
            </Button>
          </>
        )}
        {appointment.paymentStatus === "UNPAID" && (
          <Button size="sm" variant="ghost" onClick={handleRequestPayment}>
            <MessageCircle className="h-4 w-4" />
            Solicitar pagamento
          </Button>
        )}
        {appointment.status === "COMPLETED" && appointment.paymentStatus === "UNPAID" && (
          <Button size="sm" onClick={() => setPaymentModalOpen(true)}>
            <Wallet className="h-4 w-4" />
            Confirmar pagamento
          </Button>
        )}
      </div>

      <ConfirmPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        appointment={appointment}
      />
    </div>
  );
}

export { AppointmentCard };
