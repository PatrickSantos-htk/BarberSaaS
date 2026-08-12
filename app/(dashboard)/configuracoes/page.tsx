"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth/store";
import { updateBusinessHours, updatePixKey, updateShopName, updateSlug } from "@/lib/auth/profile";

// Faixa Unicode das marcas diacríticas combinantes (acentos após NFD),
// construída a partir dos códigos numéricos pra evitar caracteres literais
// de acento soltos no arquivo-fonte.
const DIACRITICS_REGEX = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ConfiguracoesPage() {
  const shopName = useAuthStore((state) => state.shopName);
  const pixKey = useAuthStore((state) => state.pixKey);
  const slug = useAuthStore((state) => state.slug);
  const businessHoursStart = useAuthStore((state) => state.businessHoursStart);
  const businessHoursEnd = useAuthStore((state) => state.businessHoursEnd);

  const [shopNameInput, setShopNameInput] = useState("");
  const [pixKeyInput, setPixKeyInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [slugInput, setSlugInput] = useState("");
  const [hoursStartInput, setHoursStartInput] = useState("09:00");
  const [hoursEndInput, setHoursEndInput] = useState("19:00");
  const [savingBooking, setSavingBooking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShopNameInput(shopName ?? "");
    setPixKeyInput(pixKey ?? "");
  }, [shopName, pixKey]);

  useEffect(() => {
    setSlugInput(slug ?? "");
    setHoursStartInput(businessHoursStart);
    setHoursEndInput(businessHoursEnd);
  }, [slug, businessHoursStart, businessHoursEnd]);

  const bookingUrl =
    typeof window !== "undefined" && slug ? `${window.location.origin}/agendar/${slug}` : "";

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

  async function handleSaveBooking(event: FormEvent) {
    event.preventDefault();
    const cleanSlug = slugify(slugInput);
    if (!cleanSlug) {
      toast.error("Informe um link válido.");
      return;
    }

    setSavingBooking(true);
    try {
      const tasks: Promise<void>[] = [];
      if (cleanSlug !== slug) tasks.push(updateSlug(cleanSlug));
      if (hoursStartInput !== businessHoursStart || hoursEndInput !== businessHoursEnd) {
        tasks.push(updateBusinessHours(hoursStartInput, hoursEndInput));
      }
      await Promise.all(tasks);
      toast.success("Configurações de agendamento salvas.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("duplicate key")) {
        toast.error("Esse link já está em uso por outra barbearia. Escolha outro.");
      } else {
        toast.error("Não foi possível salvar. Tente novamente.");
      }
    } finally {
      setSavingBooking(false);
    }
  }

  async function handleCopy() {
    if (!bookingUrl) return;
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
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

      <Card>
        <CardHeader className="flex-col items-start">
          <CardTitle>Agendamento público</CardTitle>
          <CardDescription>
            Link pra seus clientes marcarem horário sozinhos, sem precisar ligar ou mandar mensagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookingUrl ? (
            <div className="mb-4 flex items-center gap-2 rounded-sm border border-border-strong bg-surface-raised px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{bookingUrl}</span>
              <Button type="button" size="icon" variant="ghost" aria-label="Copiar link" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-status-confirmed" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ) : null}

          <form onSubmit={handleSaveBooking} className="space-y-4">
            <div>
              <Label htmlFor="settings-slug">Link personalizado</Label>
              <Input
                id="settings-slug"
                placeholder="barbearia-do-ze"
                value={slugInput}
                onChange={(event) => setSlugInput(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="settings-hours-start">Abre às</Label>
                <Input
                  id="settings-hours-start"
                  type="time"
                  value={hoursStartInput}
                  onChange={(event) => setHoursStartInput(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settings-hours-end">Fecha às</Label>
                <Input
                  id="settings-hours-end"
                  type="time"
                  value={hoursEndInput}
                  onChange={(event) => setHoursEndInput(event.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={savingBooking}>
              {savingBooking ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
