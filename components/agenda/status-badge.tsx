import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  type AppointmentStatus,
  type PaymentStatus,
} from "@/lib/types";

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
  return (
    <Badge variant={status === "PAID" ? "confirmed" : "neutral"}>
      {PAYMENT_STATUS_LABEL[status]}
    </Badge>
  );
}

export { AppointmentStatusBadge, PaymentStatusBadge };
