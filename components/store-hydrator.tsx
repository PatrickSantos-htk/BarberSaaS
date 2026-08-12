"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Scissors } from "lucide-react";
import { hydrateStore } from "@/lib/data/hydrate";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

function StoreHydrator({ children }: { children: ReactNode }) {
  const hydrated = useAppStore((state) => state.hydrated);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    hydrateStore().catch((err: unknown) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="font-display text-lg text-foreground">Não foi possível carregar os dados</p>
        <p className="max-w-sm text-sm text-muted">{error}</p>
        <Button onClick={() => setAttempt((n) => n + 1)}>Tentar novamente</Button>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <Scissors className="h-6 w-6 animate-pulse text-accent" aria-hidden="true" />
        <p className="text-sm text-muted">Carregando barbearia…</p>
      </div>
    );
  }

  return <>{children}</>;
}

export { StoreHydrator };
