"use client";

import { CalendarX } from "lucide-react";
import { AppointmentCard } from "@/components/agenda/appointment-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppointmentsByDate } from "@/lib/data/appointments";

function DayView({ date }: { date: string }) {
  const appointments = useAppointmentsByDate(date).slice().sort((a, b) => a.time.localeCompare(b.time));

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="Nenhum horário agendado"
        description="Use o botão “Novo agendamento” para adicionar um horário neste dia."
      />
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}

export { DayView };
