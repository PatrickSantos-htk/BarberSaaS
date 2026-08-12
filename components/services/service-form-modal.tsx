"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { Service } from "@/lib/types";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
  onSubmit: (input: { name: string; price: number; durationMinutes: number }) => void;
}

function ServiceFormModal({ open, onOpenChange, service, onSubmit }: ServiceFormModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(service?.name ?? "");
      setPrice(service ? String(service.price) : "");
      setDuration(service ? String(service.durationMinutes) : "");
      setError("");
    }
  }, [open, service]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const priceValue = Number(price.replace(",", "."));
    const durationValue = Number(duration);

    if (!name.trim()) return setError("Informe o nome do serviço.");
    if (!priceValue || priceValue <= 0) return setError("Informe um valor válido.");
    if (!durationValue || durationValue <= 0) return setError("Informe uma duração válida.");

    onSubmit({ name: name.trim(), price: priceValue, durationMinutes: durationValue });
    toast.success(service ? "Serviço atualizado." : "Serviço cadastrado.");
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title={service ? "Editar serviço" : "Novo serviço"}
        description="Nome, valor e duração aparecem na agenda e nos relatórios."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service-name">Nome do serviço</Label>
            <Input
              id="service-name"
              placeholder="Ex: Corte Simples"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="service-price">Valor (R$)</Label>
              <Input
                id="service-price"
                inputMode="decimal"
                placeholder="40"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="service-duration">Duração (min)</Label>
              <Input
                id="service-duration"
                inputMode="numeric"
                placeholder="30"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>
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
            <Button type="submit">{service ? "Salvar alterações" : "Cadastrar serviço"}</Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { ServiceFormModal };
