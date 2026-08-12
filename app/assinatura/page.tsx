"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loadProfile } from "@/lib/auth/profile";
import { useAuthStore } from "@/lib/auth/store";
import { signOut } from "@/lib/auth/actions";
import { formatCurrencyBRL } from "@/lib/utils";

const MONTHLY_PRICE = 29.9;

function daysRemaining(trialEndsAt: string | null) {
  if (!trialEndsAt) return 0;
  const diffMs = new Date(trialEndsAt).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function AssinaturaPage() {
  const loaded = useAuthStore((state) => state.loaded);
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const trialEndsAt = useAuthStore((state) => state.trialEndsAt);
  const cpfCnpj = useAuthStore((state) => state.cpfCnpj);

  const [cpfCnpjInput, setCpfCnpjInput] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProfile().catch(() => {});
  }, []);

  useEffect(() => {
    setCpfCnpjInput(cpfCnpj ?? "");
  }, [cpfCnpj]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpfCnpj: cpfCnpjInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Não foi possível criar a assinatura.");
      window.location.href = data.invoiceUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a assinatura.");
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  const remaining = daysRemaining(trialEndsAt);
  const trialActive = subscriptionStatus === "trial" && remaining > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Scissors className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display text-2xl text-foreground">
            Barber<span className="text-accent">°</span>
          </span>
        </div>

        <Card>
          <CardHeader className="flex-col items-start">
            <CardTitle>Assinatura</CardTitle>
            <CardDescription>
              {subscriptionStatus === "active"
                ? "Sua assinatura está ativa."
                : subscriptionStatus === "past_due"
                  ? "Identificamos um pagamento em atraso."
                  : trialActive
                    ? `Faltam ${remaining} dia${remaining === 1 ? "" : "s"} do seu teste grátis.`
                    : "Seu teste grátis de 30 dias terminou."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionStatus === "active" ? (
              <p className="text-sm text-muted">
                Cobramos {formatCurrencyBRL(MONTHLY_PRICE)}/mês. Qualquer dúvida, é só chamar.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subscribe-cpf-cnpj">CPF ou CNPJ</Label>
                  <Input
                    id="subscribe-cpf-cnpj"
                    placeholder="Só números"
                    value={cpfCnpjInput}
                    onChange={(event) => setCpfCnpjInput(event.target.value)}
                    required
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Exigido pela Asaas (nosso processador de pagamento) para gerar a cobrança.
                  </p>
                </div>
                {error ? (
                  <p role="alert" className="text-sm text-status-canceled">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" className="w-full" disabled={submitting || !loaded}>
                  {submitting ? "Gerando cobrança…" : `Assinar por ${formatCurrencyBRL(MONTHLY_PRICE)}/mês`}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Você escolhe PIX ou cartão na tela de pagamento da Asaas.
                </p>
              </form>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-center text-sm text-muted hover:text-foreground"
            >
              Sair da conta
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
