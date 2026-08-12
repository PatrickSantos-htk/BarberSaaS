"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { GoogleButton } from "@/components/auth/google-button";
import { signInWithGoogle, signInWithPassword } from "@/lib/auth/actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithPassword({ email, password });
      window.location.href = "/";
    } catch {
      setError("E-mail ou senha inválidos.");
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível entrar com Google. Tente novamente.");
      setGoogleLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-col items-start">
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse o painel da sua barbearia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton label="Entrar com Google" onClick={handleGoogle} disabled={googleLoading || submitting} />

        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
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
            {submitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-accent hover:underline">
            Cadastre sua barbearia
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
