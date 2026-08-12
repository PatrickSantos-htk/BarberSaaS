import { useAppStore } from "@/lib/store";
import type { Client } from "@/lib/types";

export function useClients() {
  return useAppStore((state) => state.clients);
}

export function useClient(id: string | undefined) {
  return useAppStore((state) => state.clients.find((client) => client.id === id));
}

export function createClient(input: Omit<Client, "id" | "createdAt">) {
  useAppStore.getState().addClient(input);
}

export function updateClient(id: string, input: Omit<Client, "id" | "createdAt">) {
  useAppStore.getState().updateClient(id, input);
}

export function deleteClient(id: string) {
  useAppStore.getState().removeClient(id);
}
