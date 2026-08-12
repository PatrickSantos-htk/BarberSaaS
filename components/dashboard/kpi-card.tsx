import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "positive" | "negative";
  className?: string;
}

const TONE_CLASS: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "text-foreground",
  positive: "text-status-confirmed",
  negative: "text-status-canceled",
};

function KpiCard({ icon: Icon, label, value, caption, tone = "default", className }: KpiCardProps) {
  return (
    <div className={cn("rounded-md border border-border border-l-4 border-l-accent bg-surface p-5", className)}>
      <div className="mb-3 flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn("font-display text-3xl", TONE_CLASS[tone])}>{value}</p>
      {caption ? <p className="mt-1 text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export { KpiCard };
