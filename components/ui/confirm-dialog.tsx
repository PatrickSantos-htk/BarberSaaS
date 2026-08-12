"use client";

import { useState } from "react";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description = "Essa ação não pode ser desfeita.",
  confirmLabel = "Confirmar",
  destructive = true,
  onConfirm,
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <ModalContent title={title} description={description}>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" disabled={submitting} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant={destructive ? "destructive" : "primary"} disabled={submitting} onClick={handleConfirm}>
            {submitting ? "Aguarde…" : confirmLabel}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmDialog };
