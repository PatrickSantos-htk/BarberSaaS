import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-sm border border-border-strong bg-surface-raised px-3 text-sm text-foreground placeholder:text-muted-foreground",
        "outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-20 rounded-sm border border-border-strong bg-surface-raised px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        "outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted", className)}
      {...props}
    />
  );
}

export { Input, Textarea, Label };
