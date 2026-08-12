import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { Service } from "@/lib/types";

interface ServiceRow {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

function mapRow(row: ServiceRow): Service {
  return { id: row.id, name: row.name, price: Number(row.price), durationMinutes: row.duration_minutes };
}

export function useServices() {
  return useAppStore((state) => state.services);
}

export function useService(id: string | undefined) {
  return useAppStore((state) => state.services.find((service) => service.id === id));
}

export async function fetchServices() {
  const { data, error } = await supabase.from("services").select("*").order("name");
  if (error) throw error;
  return (data as ServiceRow[]).map(mapRow);
}

export async function createService(input: Omit<Service, "id">) {
  const { data, error } = await supabase
    .from("services")
    .insert({ name: input.name, price: input.price, duration_minutes: input.durationMinutes })
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().addService(mapRow(data as ServiceRow));
}

export async function updateService(id: string, input: Omit<Service, "id">) {
  const { data, error } = await supabase
    .from("services")
    .update({ name: input.name, price: input.price, duration_minutes: input.durationMinutes })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().replaceService(id, mapRow(data as ServiceRow));
}

export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
  useAppStore.getState().removeServiceLocal(id);
}
