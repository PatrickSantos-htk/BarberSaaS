"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;

interface ModalContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  title: string;
  description?: string;
}

/**
 * Renders as a bottom sheet on mobile and a centered dialog from `md:` up,
 * per the Editorial Premium responsive spec — one primitive, no breakpoint JS.
 */
function ModalContent({ className, title, description, children, ...props }: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-surface-raised border border-border-strong shadow-2xl shadow-black/50 outline-none",
          "inset-x-0 bottom-0 max-h-[88vh] rounded-t-lg",
          "md:inset-x-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          "md:w-full md:max-w-md md:rounded-lg md:max-h-[85vh]",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <DialogPrimitive.Title className="font-display text-lg text-foreground">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 text-sm text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close
            className="shrink-0 rounded-sm p-1 text-muted hover:bg-surface hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 border-t border-border p-5", className)}
    {...props}
  />
);

export { Modal, ModalTrigger, ModalContent, ModalFooter };
