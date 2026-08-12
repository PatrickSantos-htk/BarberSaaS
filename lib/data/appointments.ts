import { useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { Appointment, AppointmentStatus, PaymentMethod } from "@/lib/types";

interface AppointmentRow {
  id: string;
  client_id: string;
  service_id: string;
  date: string;
  time: string;
  price: number;
  status: AppointmentStatus;
  payment_status: Appointment["paymentStatus"];
  payment_method: PaymentMethod | null;
  payment_due_date: string | null;
}

function mapRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    clientId: row.client_id,
    serviceId: row.service_id,
    date: row.date,
    time: row.time.slice(0, 5),
    price: Number(row.price),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    paymentDueDate: row.payment_due_date,
  };
}

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

export async function fetchAppointments() {
  const { data, error } = await supabase.from("appointments").select("*").order("date").order("time");
  if (error) throw error;
  return (data as AppointmentRow[]).map(mapRow);
}

export async function createAppointment(
  input: Omit<Appointment, "id" | "status" | "paymentStatus" | "paymentMethod">
) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_id: input.clientId,
      service_id: input.serviceId,
      date: input.date,
      time: input.time,
      price: input.price,
      payment_due_date: input.paymentDueDate,
    })
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().addAppointment(mapRow(data as AppointmentRow));
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().replaceAppointment(id, mapRow(data as AppointmentRow));
}

export async function markAppointmentPaid(id: string, method: PaymentMethod) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ payment_status: "PAID", payment_method: method })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().replaceAppointment(id, mapRow(data as AppointmentRow));
}
