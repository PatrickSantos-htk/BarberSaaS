"use client";

import { useState } from "react";
import { MessageCircle, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/agenda/status-badge";
import { ConfirmPaymentModal } from "@/components/agenda/confirm-payment-modal";
import { useClient } from "@/lib/data/clients";
import { useService } from "@/lib/data/services";
import { deleteAppointment, updateAppointmentStatus } from "@/lib/data/appointments";
import { useAuthStore } from "@/lib/auth/store";
import { buildConfirmationMessage, buildPaymentChargeMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn, formatCurrencyBRL } from "@/lib/utils";

const STATUS_ACCENT: Record<Appointment["status"], string> = {
  PENDING: "border-l-status-pending",
  CONFIRMED: "border-l-status-confirmed",
  COMPLETED: "border-l-status-completed",
  CANCELED: "border-l-status-canceled",
};

function accentClassFor(appointment: Appointment) {
  if (appointment.status === "COMPLETED" && appointment.paymentStatus === "PAID") {
    return "border-l-status-paid";
  }
  return STATUS_ACCENT[appointment.status];
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const client = useClient(appointment.clientId);
  const service = useService(appointment.serviceId);
  const pixKey = useAuthStore((state) => state.pixKey);
  const shopName = useAuthStore((state) => state.shopName);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const whatsappLink = buildWhatsAppLink(
    client?.phone ?? "",
    buildPaymentChargeMessage({
      clientName: client?.name ?? "cliente",
      serviceName: service?.name ?? "serviço",
      price: appointment.price,
      pixKey,
    })
  );

  const confirmationLink = buildWhatsAppLink(
    client?.phone ?? "",
    buildConfirmationMessage({
      clientName: client?.name ?? "cliente",
      shopName: shopName ?? "a barbearia",
      serviceName: service?.name ?? "serviço",
      price: appointment.price,
      date: appointment.date,
      time: appointment.time,
      pixKey,
    })
  );

  async function handleStatusChange(status: AppointmentStatus) {
    setUpdatingStatus(true);
    try {
      await updateAppointmentStatus(appointment.id, status);
    } catch {
      toast.error("Não foi possível atualizar o status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border border-l-4 bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center",
        accentClassFor(appointment)
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
            <Button size="sm" variant="outline" disabled={updatingStatus} onClick={() => handleStatusChange("CONFIRMED")}>
              Confirmar
            </Button>
            <Button size="sm" variant="ghost" disabled={updatingStatus} onClick={() => handleStatusChange("CANCELED")}>
              Cancelar
            </Button>
          </>
        )}
        {appointment.status === "CONFIRMED" && (
          <>
            <a
              href={confirmationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              <MessageCircle className="h-4 w-4" />
              Avisar cliente
            </a>
            <Button size="sm" variant="outline" disabled={updatingStatus} onClick={() => handleStatusChange("COMPLETED")}>
              Concluir
            </Button>
            <Button size="sm" variant="ghost" disabled={updatingStatus} onClick={() => handleStatusChange("CANCELED")}>
              Cancelar
            </Button>
          </>
        )}
        {appointment.paymentStatus === "UNPAID" && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm", variant: "ghost" })}
          >
            <MessageCircle className="h-4 w-4" />
            Solicitar pagamento
          </a>
        )}
        {appointment.status === "COMPLETED" && appointment.paymentStatus === "UNPAID" && (
          <Button size="sm" onClick={() => setPaymentModalOpen(true)}>
            <Wallet className="h-4 w-4" />
            Confirmar pagamento
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Excluir agendamento"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        appointment={appointment}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir este agendamento?"
        description="Remove o horário permanentemente da agenda. Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={async () => {
          try {
            await deleteAppointment(appointment.id);
            toast.success("Agendamento excluído.");
          } catch {
            toast.error("Não foi possível excluir o agendamento.");
          }
        }}
      />
    </div>
  );
}

export { AppointmentCard };
