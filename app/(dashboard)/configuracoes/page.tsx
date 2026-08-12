"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth/store";
import { updatePixKey, updateShopName } from "@/lib/auth/profile";

export default function ConfiguracoesPage() {
  const shopName = useAuthStore((state) => state.shopName);
  const pixKey = useAuthStore((state) => state.pixKey);

  const [shopNameInput, setShopNameInput] = useState("");
  const [pixKeyInput, setPixKeyInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setShopNameInput(shopName ?? "");
    setPixKeyInput(pixKey ?? "");
  }, [shopName, pixKey]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await Promise.all([
        shopNameInput.trim() && shopNameInput !== shopName
          ? updateShopName(shopNameInput.trim())
          : Promise.resolve(),
        pixKeyInput !== (pixKey ?? "") ? updatePixKey(pixKeyInput.trim()) : Promise.resolve(),
      ]);
      toast.success("Configurações salvas.");
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader className="flex-col items-start">
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Dados usados nas mensagens de cobrança via WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="settings-shop-name">Nome da barbearia</Label>
              <Input
                id="settings-shop-name"
                value={shopNameInput}
                onChange={(event) => setShopNameInput(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="settings-pix-key">Chave PIX</Label>
              <Input
                id="settings-pix-key"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                value={pixKeyInput}
                onChange={(event) => setPixKeyInput(event.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Incluída automaticamente na mensagem de cobrança enviada pelo WhatsApp.
              </p>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
