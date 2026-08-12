"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth/store";

function hasAccess(status: string, trialEndsAt: string | null) {
  if (status === "active") return true;
  if (status === "trial" && trialEndsAt && new Date(trialEndsAt).getTime() > Date.now()) return true;
  return false;
}

function SubscriptionGate({ children }: { children: ReactNode }) {
  const loaded = useAuthStore((state) => state.loaded);
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const trialEndsAt = useAuthStore((state) => state.trialEndsAt);

  if (!loaded || hasAccess(subscriptionStatus, trialEndsAt)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex-col items-start">
          <Lock className="mb-2 h-5 w-5 text-accent" aria-hidden="true" />
          <CardTitle>
            {subscriptionStatus === "past_due" ? "Pagamento pendente" : "Seu teste grátis acabou"}
          </CardTitle>
          <CardDescription>
            {subscriptionStatus === "past_due"
              ? "Identificamos um pagamento em atraso. Regularize para continuar usando o painel."
              : "Assine por R$ 29,90/mês para continuar usando a agenda, clientes e financeiro."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/assinatura" className={buttonVariants({ className: "w-full" })}>
            Ver assinatura
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export { SubscriptionGate };
