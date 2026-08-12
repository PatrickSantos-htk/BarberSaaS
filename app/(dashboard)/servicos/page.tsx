"use client";

import { useState } from "react";
import { Plus, Scissors } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ServiceFormModal } from "@/components/services/service-form-modal";
import { ServiceList } from "@/components/services/service-list";
import { createService, deleteService, updateService, useServices } from "@/lib/data/services";
import type { Service } from "@/lib/types";

export default function ServicosPage() {
  const services = useServices();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>(undefined);
  const [deleting, setDeleting] = useState<Service | undefined>(undefined);

  function handleNew() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function handleEdit(service: Service) {
    setEditing(service);
    setFormOpen(true);
  }

  function handleSubmit(input: { name: string; price: number; durationMinutes: number }) {
    if (editing) {
      updateService(editing.id, input);
    } else {
      createService(input);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="max-w-sm text-sm text-muted">
          Cadastre os serviços oferecidos pela barbearia com valor e duração.
        </p>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Nenhum serviço cadastrado"
          description="Cadastre o primeiro serviço para começar a montar a agenda."
          action={
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4" />
              Novo serviço
            </Button>
          }
        />
      ) : (
        <ServiceList services={services} onEdit={handleEdit} onDelete={setDeleting} />
      )}

      <ServiceFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title={`Excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        onConfirm={() => {
          if (deleting) {
            deleteService(deleting.id);
            toast.success("Serviço excluído.");
          }
        }}
      />
    </div>
  );
}
