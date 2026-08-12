"use client";

import { useClient } from "@/lib/data/clients";
import type { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<Appointment["status"], string> = {
  PENDING: "bg-status-pending",
  CONFIRMED: "bg-status-confirmed",
  COMPLETED: "bg-status-completed",
  CANCELED: "bg-status-canceled",
};

const STATUS_TEXT: Record<Appointment["status"], string> = {
  PENDING: "text-status-pending",
  CONFIRMED: "text-status-confirmed",
  COMPLETED: "text-status-completed",
  CANCELED: "text-status-canceled",
};

function AppointmentChip({ appointment }: { appointment: Appointment }) {
  const client = useClient(appointment.clientId);

  return (
    <div className="flex items-center gap-1.5 rounded-sm bg-surface-raised px-2 py-1 text-left text-xs">
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[appointment.status])} aria-hidden="true" />
      <span className={cn("shrink-0 font-medium", STATUS_TEXT[appointment.status])}>{appointment.time}</span>
      <span className="truncate text-muted">{client?.name ?? "—"}</span>
    </div>
  );
}

export { AppointmentChip };
