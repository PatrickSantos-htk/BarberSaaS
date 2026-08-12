"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { GoogleButton } from "@/components/auth/google-button";
import { signInWithGoogle, signUpWithPassword } from "@/lib/auth/actions";

export default function CadastroPage() {
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!shopName.trim()) return setError("Informe o nome da barbearia.");
    if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");

    setSubmitting(true);
    try {
      const { confirmedImmediately } = await signUpWithPassword({
        shopName: shopName.trim(),
        email,
        password,
      });
      if (confirmedImmediately) {
        window.location.href = "/";
        return;
      }
      setAwaitingConfirmation(true);
    } catch {
      setError("Não foi possível criar a conta. O e-mail já pode estar em uso.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível continuar com Google. Tente novamente.");
      setGoogleLoading(false);
    }
  }

  if (awaitingConfirmation) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-5 text-center">
          <MailCheck className="h-8 w-8 text-accent" aria-hidden="true" />
          <p className="font-display text-lg text-foreground">Confirme seu e-mail</p>
          <p className="text-sm text-muted">
            Enviamos um link de confirmação para <strong className="text-foreground">{email}</strong>.
            Clique nele para ativar sua conta e entrar no painel.
          </p>
          <Link href="/login" className="text-sm text-accent hover:underline">
            Já confirmei, ir para o login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-col items-start">
        <CardTitle>Cadastrar barbearia</CardTitle>
        <CardDescription>
          30 dias grátis para testar. Depois, R$ 29,90/mês para continuar usando — sem cobrança
          durante o teste.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton
          label="Cadastrar com Google"
          onClick={handleGoogle}
          disabled={googleLoading || submitting}
        />

        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="signup-shop">Nome da barbearia</Label>
            <Input
              id="signup-shop"
              placeholder="Ex: Barbearia do Zé"
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="signup-email">E-mail</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="signup-password">Senha</Label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-status-canceled">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={submitting || googleLoading}>
            {submitting ? "Criando conta…" : "Cadastrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
