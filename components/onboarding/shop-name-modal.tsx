"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { updateShopName } from "@/lib/auth/profile";

function ShopNameModal() {
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!shopName.trim()) return setError("Informe o nome da barbearia.");

    setError("");
    setSubmitting(true);
    try {
      await updateShopName(shopName.trim());
      toast.success("Barbearia configurada.");
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <Modal open>
      <ModalContent
        title="Como se chama sua barbearia?"
        description="Esse nome aparece no painel. Você pode mudar depois."
        hideClose
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="onboarding-shop-name">Nome da barbearia</Label>
            <Input
              id="onboarding-shop-name"
              placeholder="Ex: Barbearia do Zé"
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              autoFocus
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-status-canceled">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Salvando…" : "Continuar"}
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { ShopNameModal };
