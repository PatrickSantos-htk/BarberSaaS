import { useAppStore } from "@/lib/store";
import type { Service } from "@/lib/types";

export function useServices() {
  return useAppStore((state) => state.services);
}

export function useService(id: string | undefined) {
  return useAppStore((state) => state.services.find((service) => service.id === id));
}

export function createService(input: Omit<Service, "id">) {
  useAppStore.getState().addService(input);
}

export function updateService(id: string, input: Omit<Service, "id">) {
  useAppStore.getState().updateService(id, input);
}

export function deleteService(id: string) {
  useAppStore.getState().removeService(id);
}
