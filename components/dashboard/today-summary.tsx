import { ArrowRight } from "lucide-react";
import { AppointmentStatusBadge } from "@/components/agenda/status-badge";
import type { Appointment, Client, Service } from "@/lib/types";
import { formatCurrencyBRL } from "@/lib/utils";

interface TodaySummaryProps {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
}

function TodaySummary({ appointments, clients, services }: TodaySummaryProps) {
  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;
  const revenueToday = appointments
    .filter((a) => a.paymentStatus === "PAID")
    .reduce((total, a) => total + a.price, 0);

  const next = appointments
    .filter((a) => a.status === "PENDING" || a.status === "CONFIRMED")
    .sort((a, b) => a.time.localeCompare(b.time))[0];
  const nextClient = next ? clients.find((c) => c.id === next.clientId) : undefined;
  const nextService = next ? services.find((s) => s.id === next.serviceId) : undefined;

  return (
    <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Hoje</p>
          <p className="font-display text-xl text-foreground">{appointments.length} agendamentos</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-sm bg-status-pending-bg px-2 py-1 text-status-pending">
            {pending} pendente{pending === 1 ? "" : "s"}
          </span>
          <span className="rounded-sm bg-status-confirmed-bg px-2 py-1 text-status-confirmed">
            {confirmed} confirmado{confirmed === 1 ? "" : "s"}
          </span>
          <span className="rounded-sm bg-status-completed-bg px-2 py-1 text-status-completed">
            {completed} concluído{completed === 1 ? "" : "s"}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Recebido hoje</p>
          <p className="font-display text-xl text-accent">{formatCurrencyBRL(revenueToday)}</p>
        </div>
      </div>

      {next ? (
        <div className="flex items-center gap-3 rounded-sm border border-border-strong bg-surface-raised px-4 py-2.5">
          <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Próximo</p>
            <p className="truncate text-sm text-foreground">
              <span className="font-medium">{next.time}</span> · {nextClient?.name ?? "—"} ·{" "}
              {nextService?.name ?? "—"}
            </p>
          </div>
          <AppointmentStatusBadge status={next.status} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum horário pendente hoje.</p>
      )}
    </div>
  );
}

export { TodaySummary };
