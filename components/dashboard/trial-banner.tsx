"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth/store";
import { formatCurrencyBRL } from "@/lib/utils";

const MONTHLY_PRICE = 29.9;

function daysRemaining(trialEndsAt: string | null) {
  if (!trialEndsAt) return 0;
  return Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function TrialBanner() {
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const trialEndsAt = useAuthStore((state) => state.trialEndsAt);
  const remaining = daysRemaining(trialEndsAt);

  if (subscriptionStatus !== "trial" || remaining > 7 || remaining <= 0) return null;

  return (
    <div className="panel flex flex-wrap items-center gap-3 border-l-4 border-l-status-pending p-4">
      <Clock className="h-4 w-4 shrink-0 text-status-pending" aria-hidden="true" />
      <p className="flex-1 text-sm text-foreground">
        Seu teste grátis termina em {remaining} dia{remaining === 1 ? "" : "s"}. Depois disso, a
        assinatura custa {formatCurrencyBRL(MONTHLY_PRICE)}/mês.
      </p>
      <Link href="/assinatura" className={buttonVariants({ size: "sm" })}>
        Assinar agora
      </Link>
    </div>
  );
}

export { TrialBanner };
