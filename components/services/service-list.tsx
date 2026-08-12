"use client";

import { Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";
import { formatCurrencyBRL } from "@/lib/utils";

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  return (
    <ul className="divide-y divide-border rounded-md border border-border bg-surface">
      {services.map((service) => (
        <li key={service.id} className="flex items-center gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-base text-foreground">{service.name}</span>
              <span
                className="mx-1 hidden flex-1 border-b border-dotted border-border-strong sm:block"
                aria-hidden="true"
              />
              <span className="font-display text-lg text-accent">
                {formatCurrencyBRL(service.price)}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {service.durationMinutes} minutos
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Editar ${service.name}`}
              onClick={() => onEdit(service)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Excluir ${service.name}`}
              onClick={() => onDelete(service)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export { ServiceList };
