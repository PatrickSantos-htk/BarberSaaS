"use client";

import { AppointmentChip } from "@/components/agenda/appointment-chip";
import { DayView } from "@/components/agenda/day-view";
import { useAppointmentsByDate } from "@/lib/data/appointments";
import { addDays, formatDayMonthPT, formatWeekdayShortPT } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  weekStart: string;
  selectedDate: string;
  onSelectDay: (date: string) => void;
}

function WeekDayColumn({
  date,
  isSelected,
  onSelectDay,
}: {
  date: string;
  isSelected: boolean;
  onSelectDay: (date: string) => void;
}) {
  const appointments = useAppointmentsByDate(date).slice().sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="panel flex min-w-0 flex-col">
      <button
        type="button"
        onClick={() => onSelectDay(date)}
        className={cn(
          "border-b border-border px-2 py-2 text-center transition-colors hover:bg-surface-raised",
          isSelected && "bg-accent/10"
        )}
      >
        <p className="text-[11px] uppercase tracking-wide text-muted">{formatWeekdayShortPT(date)}</p>
        <p className={cn("font-display text-lg", isSelected ? "text-accent" : "text-foreground")}>
          {date.slice(-2)}
        </p>
      </button>
      <div className="flex-1 space-y-1 overflow-y-auto p-1.5" style={{ maxHeight: 260 }}>
        {appointments.length === 0 ? (
          <p className="px-1 pt-2 text-center text-[11px] text-muted-foreground">Livre</p>
        ) : (
          appointments.map((appointment) => (
            <AppointmentChip key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  );
}

function WeekView({ weekStart, selectedDate, onSelectDay }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <>
      <div className="hidden gap-2 md:grid md:grid-cols-7">
        {days.map((date) => (
          <WeekDayColumn key={date} date={date} isSelected={date === selectedDate} onSelectDay={onSelectDay} />
        ))}
      </div>

      <div className="space-y-6 md:hidden">
        {days.map((date) => (
          <section key={date}>
            <h2 className="mb-2 font-display text-base text-foreground">
              <span className="capitalize">{formatWeekdayShortPT(date)}</span>, {formatDayMonthPT(date)}
            </h2>
            <DayView date={date} />
          </section>
        ))}
      </div>
    </>
  );
}

export { WeekView };
