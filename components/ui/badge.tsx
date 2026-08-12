import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        neutral: "bg-surface-raised text-muted border border-border-strong",
        accent: "bg-accent/15 text-accent border border-accent/30",
        pending: "bg-status-pending-bg text-status-pending border border-status-pending/30",
        confirmed: "bg-status-confirmed-bg text-status-confirmed border border-status-confirmed/30",
        completed: "bg-status-completed-bg text-status-completed border border-status-completed/30",
        canceled: "bg-status-canceled-bg text-status-canceled border border-status-canceled/30",
        paid: "bg-status-paid-bg text-status-paid border border-status-paid/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dotClassName?: string;
  icon?: React.ReactNode;
}

function Badge({ className, variant, dotClassName, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {icon ?? <span className={cn("h-1.5 w-1.5 rounded-full bg-current", dotClassName)} aria-hidden="true" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
