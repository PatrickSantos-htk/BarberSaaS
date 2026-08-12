import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "positive" | "negative";
  /** Percentage change vs. the previous period. `goodDirection` controls which sign reads as positive. */
  delta?: { pct: number; goodDirection?: "up" | "down" };
  className?: string;
}

const TONE_CLASS: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "text-foreground",
  positive: "text-status-confirmed",
  negative: "text-status-canceled",
};

function DeltaPill({ pct, goodDirection = "up" }: NonNullable<KpiCardProps["delta"]>) {
  const isUp = pct >= 0;
  const isGood = isUp ? goodDirection === "up" : goodDirection === "down";
  const Icon = isUp ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isGood ? "text-status-confirmed" : "text-status-canceled"
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, caption, tone = "default", delta, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border border-l-4 border-l-accent bg-surface p-5",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={cn("font-display text-3xl", TONE_CLASS[tone])}>{value}</p>
        {delta ? <DeltaPill {...delta} /> : null}
      </div>
      {caption ? <p className="mt-1 text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export { KpiCard };
