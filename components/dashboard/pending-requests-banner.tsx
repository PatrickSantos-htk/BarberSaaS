"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppointments, updateAppointmentStatus } from "@/lib/data/appointments";
import { useClients } from "@/lib/data/clients";
import { useServices } from "@/lib/data/services";
import type { Appointment } from "@/lib/types";
import { formatCurrencyBRL, formatDateBR, todayISO } from "@/lib/utils";

function PendingRequestRow({ appointment }: { appointment: Appointment }) {
  const clients = useClients();
  const services = useServices();
  const [updating, setUpdating] = useState(false);
  const client = clients.find((c) => c.id === appointment.clientId);
  const service = services.find((s) => s.id === appointment.serviceId);

  async function handleChange(status: "CONFIRMED" | "CANCELED") {
    setUpdating(true);
    try {
      await updateAppointmentStatus(appointment.id, status);
    } catch {
      toast.error("Não foi possível atualizar o status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">{client?.name ?? "Cliente removido"}</p>
        <p className="text-xs text-muted">
          {formatDateBR(appointment.date)} às {appointment.time} · {service?.name ?? "—"} ·{" "}
          {formatCurrencyBRL(appointment.price)}
        </p>
      </div>
      <Button size="sm" variant="outline" disabled={updating} onClick={() => handleChange("CONFIRMED")}>
        Confirmar
      </Button>
      <Button size="sm" variant="ghost" disabled={updating} onClick={() => handleChange("CANCELED")}>
        Cancelar
      </Button>
    </li>
  );
}

function PendingRequestsBanner() {
  const appointments = useAppointments();
  const today = todayISO();

  const pending = appointments
    .filter((appointment) => appointment.status === "PENDING" && appointment.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (pending.length === 0) return null;

  return (
    <div className="panel flex flex-col gap-2 border-l-4 border-l-status-pending p-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-status-pending" aria-hidden="true" />
        <p className="font-display text-base text-foreground">
          {pending.length} solicitaç{pending.length === 1 ? "ão" : "ões"} de agendamento aguardando
          confirmação
        </p>
      </div>
      <ul className="divide-y divide-border">
        {pending.map((appointment) => (
          <PendingRequestRow key={appointment.id} appointment={appointment} />
        ))}
      </ul>
    </div>
  );
}

export { PendingRequestsBanner };
