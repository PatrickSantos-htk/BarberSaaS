"use client";

import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { mapAppointmentRow, type AppointmentRow } from "@/lib/data/appointments";
import { mapClientRow, type ClientRow } from "@/lib/data/clients";
import { useAuthStore } from "@/lib/auth/store";
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";

/**
 * Agendamentos criados pelo link público (ou por outra aba/dispositivo) não
 * passam pelas funções locais que atualizam o Zustand — sem isso o dono só
 * veria a solicitação depois de recarregar a página manualmente.
 */
function RealtimeSync() {
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`sync-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<AppointmentRow>) => {
          const store = useAppStore.getState();
          if (payload.eventType === "INSERT") {
            const appointment = mapAppointmentRow(payload.new as AppointmentRow);
            if (!store.appointments.some((a) => a.id === appointment.id)) {
              store.addAppointment(appointment);
            }
          } else if (payload.eventType === "UPDATE") {
            store.replaceAppointment(
              (payload.new as AppointmentRow).id,
              mapAppointmentRow(payload.new as AppointmentRow)
            );
          } else if (payload.eventType === "DELETE") {
            store.removeAppointmentLocal((payload.old as { id: string }).id);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients", filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<ClientRow>) => {
          const store = useAppStore.getState();
          if (payload.eventType === "INSERT") {
            const client = mapClientRow(payload.new as ClientRow);
            if (!store.clients.some((c) => c.id === client.id)) {
              store.addClient(client);
            }
          } else if (payload.eventType === "UPDATE") {
            store.replaceClient((payload.new as ClientRow).id, mapClientRow(payload.new as ClientRow));
          } else if (payload.eventType === "DELETE") {
            store.removeClientLocal((payload.old as { id: string }).id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
}

export { RealtimeSync };
