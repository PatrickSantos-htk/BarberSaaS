"use client";

import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
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
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title={title} description={description}>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmDialog };
