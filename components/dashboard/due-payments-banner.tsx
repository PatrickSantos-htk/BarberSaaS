"use client";

import { AlertTriangle, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAppointments } from "@/lib/data/appointments";
import { useClients } from "@/lib/data/clients";
import { useServices } from "@/lib/data/services";
import { useAuthStore } from "@/lib/auth/store";
import { buildPaymentChargeMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatCurrencyBRL, formatDateBR, todayISO } from "@/lib/utils";

function DuePaymentsBanner() {
  const appointments = useAppointments();
  const clients = useClients();
  const services = useServices();
  const pixKey = useAuthStore((state) => state.pixKey);
  const today = todayISO();

  const due = appointments.filter(
    (appointment) =>
      appointment.paymentStatus === "UNPAID" &&
      appointment.paymentDueDate !== null &&
      appointment.paymentDueDate <= today
  );

  if (due.length === 0) return null;

  return (
    <div className="panel flex flex-col gap-3 border-l-4 border-l-status-pending p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-status-pending" aria-hidden="true" />
        <p className="font-display text-base text-foreground">
          {due.length} cobrança{due.length === 1 ? "" : "s"} vencendo ou vencida
          {due.length === 1 ? "" : "s"}
        </p>
      </div>
      <ul className="divide-y divide-border">
        {due.map((appointment) => {
          const client = clients.find((c) => c.id === appointment.clientId);
          const service = services.find((s) => s.id === appointment.serviceId);
          const isOverdue = appointment.paymentDueDate! < today;
          const link = buildWhatsAppLink(
            client?.phone ?? "",
            buildPaymentChargeMessage({
              clientName: client?.name ?? "cliente",
              serviceName: service?.name ?? "serviço",
              price: appointment.price,
              pixKey,
            })
          );

          return (
            <li key={appointment.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  {client?.name ?? "Cliente removido"}
                </p>
                <p className="text-xs text-muted">
                  {isOverdue ? "Venceu em" : "Vence em"} {formatDateBR(appointment.paymentDueDate!)} ·{" "}
                  {formatCurrencyBRL(appointment.price)}
                </p>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "sm" })}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar cobrança
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { DuePaymentsBanner };
