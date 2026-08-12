"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { Client } from "@/lib/types";
import { formatPhoneBR } from "@/lib/utils";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onSubmit: (input: { name: string; phone: string; email: string }) => Promise<void>;
}

function ClientFormModal({ open, onOpenChange, client, onSubmit }: ClientFormModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(client?.name ?? "");
      setPhone(client?.phone ?? "");
      setEmail(client?.email ?? "");
      setError("");
      setSubmitting(false);
    }
  }, [open, client]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return setError("Informe o nome do cliente.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Informe um telefone com DDD válido.");

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), phone, email: email.trim() });
      toast.success(client ? "Cliente atualizado." : "Cliente cadastrado.");
      onOpenChange(false);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title={client ? "Editar cliente" : "Novo cliente"}
        description="O telefone é usado para os lembretes automáticos por WhatsApp."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client-name">Nome</Label>
            <Input
              id="client-name"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-phone">Telefone (WhatsApp com DDD)</Label>
            <Input
              id="client-phone"
              inputMode="tel"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(event) => setPhone(formatPhoneBR(event.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="client-email">E-mail</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="cliente@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-status-canceled">
              {error}
            </p>
          ) : null}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando…" : client ? "Salvar alterações" : "Cadastrar cliente"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { ClientFormModal };
