"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "@/lib/data/clients";
import { useServices } from "@/lib/data/services";
import { createAppointment } from "@/lib/data/appointments";

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
}

function NewAppointmentModal({ open, onOpenChange, defaultDate }: NewAppointmentModalProps) {
  const clients = useClients();
  const services = useServices();

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("09:00");
  const [price, setPrice] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState(defaultDate);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setClientId("");
      setServiceId("");
      setDate(defaultDate);
      setTime("09:00");
      setPrice("");
      setPaymentDueDate(defaultDate);
      setError("");
      setSubmitting(false);
    }
  }, [open, defaultDate]);

  function handleServiceChange(id: string) {
    setServiceId(id);
    const service = services.find((item) => item.id === id);
    if (service) setPrice(String(service.price));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const priceValue = Number(price.replace(",", "."));

    if (!clientId) return setError("Selecione o cliente.");
    if (!serviceId) return setError("Selecione o serviço.");
    if (!date) return setError("Selecione a data.");
    if (!time) return setError("Selecione o horário.");
    if (!priceValue || priceValue <= 0) return setError("Informe um valor válido.");

    setError("");
    setSubmitting(true);
    try {
      await createAppointment({
        clientId,
        serviceId,
        date,
        time,
        price: priceValue,
        paymentDueDate: paymentDueDate || null,
      });
      toast.success("Agendamento criado como pendente.");
      onOpenChange(false);
    } catch {
      setError("Não foi possível criar o agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title="Novo agendamento"
        description="O horário entra na agenda como pendente até a confirmação do cliente."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="appointment-client">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="appointment-client" aria-label="Selecionar cliente">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="appointment-service">Serviço</Label>
            <Select value={serviceId} onValueChange={handleServiceChange}>
              <SelectTrigger id="appointment-service" aria-label="Selecionar serviço">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="appointment-date">Data</Label>
              <Input
                id="appointment-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="appointment-time">Horário</Label>
              <Input
                id="appointment-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="appointment-price">Valor (R$)</Label>
              <Input
                id="appointment-price"
                inputMode="decimal"
                placeholder="40"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="appointment-due-date">Vencimento do pagamento</Label>
              <Input
                id="appointment-due-date"
                type="date"
                value={paymentDueDate}
                onChange={(event) => setPaymentDueDate(event.target.value)}
              />
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-status-canceled">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando…" : "Criar agendamento"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { NewAppointmentModal };
