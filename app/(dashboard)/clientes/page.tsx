"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { ClientList } from "@/components/clients/client-list";
import { createClient, deleteClient, updateClient, useClients } from "@/lib/data/clients";
import type { Client } from "@/lib/types";

export default function ClientesPage() {
  const clients = useClients();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>(undefined);
  const [deleting, setDeleting] = useState<Client | undefined>(undefined);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) || client.phone.replace(/\D/g, "").includes(query)
    );
  }, [clients, search]);

  function handleNew() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function handleSubmit(input: { name: string; phone: string; email: string }) {
    if (editing) {
      updateClient(editing.id, input);
    } else {
      createClient(input);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Buscar cliente por nome ou telefone"
            placeholder="Buscar por nome ou telefone..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users2}
          title={clients.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum resultado encontrado"}
          description={
            clients.length === 0
              ? "Cadastre o primeiro cliente para começar a agendar horários."
              : "Tente buscar por outro nome ou telefone."
          }
          action={
            clients.length === 0 ? (
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo cliente
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ClientList clients={filtered} onEdit={(client) => { setEditing(client); setFormOpen(true); }} onDelete={setDeleting} />
      )}

      <ClientFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        client={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title={`Excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        onConfirm={() => {
          if (deleting) {
            deleteClient(deleting.id);
            toast.success("Cliente excluído.");
          }
        }}
      />
    </div>
  );
}
