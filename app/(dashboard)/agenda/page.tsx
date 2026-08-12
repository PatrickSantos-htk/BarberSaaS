"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { DayView } from "@/components/agenda/day-view";
import { WeekView } from "@/components/agenda/week-view";
import { NewAppointmentModal } from "@/components/agenda/new-appointment-modal";
import { addDays, formatDayMonthPT, formatWeekdayShortPT, startOfWeek, toISODate } from "@/lib/utils";

type ViewMode = "day" | "week";

export default function AgendaPage() {
  const today = toISODate(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(today);
  const [newOpen, setNewOpen] = useState(false);

  const weekStart = startOfWeek(selectedDate);

  function handleNavigate(direction: -1 | 1) {
    setSelectedDate((current) => addDays(current, viewMode === "day" ? direction : direction * 7));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Alternar entre visão diária e semanal"
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "day", label: "Dia" },
            { value: "week", label: "Semana" },
          ]}
        />
        <Button onClick={() => setNewOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo agendamento
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Período anterior" onClick={() => handleNavigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Próximo período" onClick={() => handleNavigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(today)}>
            Hoje
          </Button>
        </div>
        <p className="text-right font-display text-lg capitalize text-foreground">
          {viewMode === "day"
            ? `${formatWeekdayShortPT(selectedDate)}, ${formatDayMonthPT(selectedDate)}`
            : `Semana de ${formatDayMonthPT(weekStart)}`}
        </p>
      </div>

      {viewMode === "day" ? (
        <DayView date={selectedDate} />
      ) : (
        <WeekView
          weekStart={weekStart}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setSelectedDate(date);
            setViewMode("day");
          }}
        />
      )}

      <NewAppointmentModal open={newOpen} onOpenChange={setNewOpen} defaultDate={selectedDate} />
    </div>
  );
}
