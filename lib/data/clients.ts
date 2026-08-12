import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { Client } from "@/lib/types";

interface ClientRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

function mapRow(row: ClientRow): Client {
  return { id: row.id, name: row.name, phone: row.phone, email: row.email, createdAt: row.created_at };
}

export function useClients() {
  return useAppStore((state) => state.clients);
}

export function useClient(id: string | undefined) {
  return useAppStore((state) => state.clients.find((client) => client.id === id));
}

export async function fetchClients() {
  const { data, error } = await supabase.from("clients").select("*").order("name");
  if (error) throw error;
  return (data as ClientRow[]).map(mapRow);
}

export async function createClient(input: Omit<Client, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("clients")
    .insert({ name: input.name, phone: input.phone, email: input.email })
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().addClient(mapRow(data as ClientRow));
}

export async function updateClient(id: string, input: Omit<Client, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("clients")
    .update({ name: input.name, phone: input.phone, email: input.email })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  useAppStore.getState().replaceClient(id, mapRow(data as ClientRow));
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
  useAppStore.getState().removeClientLocal(id);
}
