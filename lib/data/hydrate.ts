import { fetchAppointments } from "@/lib/data/appointments";
import { fetchClients } from "@/lib/data/clients";
import { fetchExpenses } from "@/lib/data/expenses";
import { fetchServices } from "@/lib/data/services";
import { useAppStore } from "@/lib/store";

export async function hydrateStore() {
  const [clients, services, appointments, expenses] = await Promise.all([
    fetchClients(),
    fetchServices(),
    fetchAppointments(),
    fetchExpenses(),
  ]);
  useAppStore.getState().setAll({ clients, services, appointments, expenses });
}
