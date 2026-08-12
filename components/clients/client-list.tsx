"use client";

import { Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/lib/data/appointments";
import type { Client } from "@/lib/types";

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  const appointments = useAppointments();

  return (
    <ul className="divide-y divide-border rounded-md border border-border bg-surface">
      {clients.map((client) => {
        const visits = appointments.filter(
          (appointment) => appointment.clientId === client.id && appointment.status === "COMPLETED"
        ).length;

        return (
          <li key={client.id} className="flex items-center gap-4 px-5 py-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/15 font-display text-sm text-accent"
              aria-hidden="true"
            >
              {initials(client.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base text-foreground">{client.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  {client.phone}
                </span>
                {client.email ? (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" aria-hidden="true" />
                    {client.email}
                  </span>
                ) : null}
              </div>
            </div>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
              {visits} {visits === 1 ? "atendimento" : "atendimentos"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar ${client.name}`}
                onClick={() => onEdit(client)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Excluir ${client.name}`}
                onClick={() => onDelete(client)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export { ClientList };
