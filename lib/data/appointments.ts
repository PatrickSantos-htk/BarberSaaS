import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import type { Appointment, AppointmentStatus, PaymentMethod } from "@/lib/types";

export function useAppointments() {
  return useAppStore((state) => state.appointments);
}

export function useAppointmentsByDate(date: string) {
  const appointments = useAppStore((state) => state.appointments);
  return useMemo(
    () => appointments.filter((appointment) => appointment.date === date),
    [appointments, date]
  );
}

export function createAppointment(
  input: Omit<Appointment, "id" | "status" | "paymentStatus" | "paymentMethod">
) {
  useAppStore.getState().addAppointment(input);
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  useAppStore.getState().updateAppointmentStatus(id, status);
}

export function markAppointmentPaid(id: string, method: PaymentMethod) {
  useAppStore.getState().markAppointmentPaid(id, method);
}
