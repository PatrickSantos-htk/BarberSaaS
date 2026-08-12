import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  type Appointment,
  type AppointmentStatus,
  type PaymentStatus,
} from "@/lib/types";

function appointmentStatusTooltip(appointment: Pick<Appointment, "status" | "paymentStatus">) {
  const statusLabel = APPOINTMENT_STATUS_LABEL[appointment.status];
  if (appointment.status === "CANCELED") return statusLabel;
  const paymentLabel =
    appointment.paymentStatus === "PAID" ? "Pago" : "Aguardando pagamento";
  return `${statusLabel} · ${paymentLabel}`;
}

const STATUS_VARIANT: Record<AppointmentStatus, "pending" | "confirmed" | "completed" | "canceled"> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELED: "canceled",
};

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{APPOINTMENT_STATUS_LABEL[status]}</Badge>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const isPaid = status === "PAID";
  return (
    <Badge
      variant={isPaid ? "paid" : "neutral"}
      icon={isPaid ? <Check className="h-3 w-3" aria-hidden="true" /> : undefined}
    >
      {PAYMENT_STATUS_LABEL[status]}
    </Badge>
  );
}

export { AppointmentStatusBadge, PaymentStatusBadge, appointmentStatusTooltip };
