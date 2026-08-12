"use client";

import { use, useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarCheck, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrencyBRL, formatPhoneBR, todayISO } from "@/lib/utils";

interface ShopInfo {
  shopName: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  services: { id: string; name: string; price: number; durationMinutes: number }[];
}

export default function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const minDate = todayISO();
  const maxDate = useMemo(() => {
    const d = new Date(`${todayISO()}T00:00:00`);
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    fetch(`/api/public/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setShop)
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setTime("");
    fetch(`/api/public/${slug}/availability?date=${date}&serviceId=${serviceId}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [slug, serviceId, date]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!serviceId) return setError("Selecione o serviço.");
    if (!time) return setError("Selecione um horário.");
    if (!clientName.trim()) return setError("Informe seu nome.");
    if (clientPhone.replace(/\D/g, "").length < 10) return setError("Informe um telefone com DDD válido.");

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`/api/public/${slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, clientName, clientPhone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Não foi possível agendar.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível agendar.");
    } finally {
      setSubmitting(false);
    }
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted">Barbearia não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Scissors className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display text-2xl text-foreground">{shop?.shopName ?? "…"}</span>
        </div>

        <Card>
          {done ? (
            <CardContent className="flex flex-col items-center gap-3 pt-5 text-center">
              <CalendarCheck className="h-8 w-8 text-accent" aria-hidden="true" />
              <p className="font-display text-lg text-foreground">Horário solicitado!</p>
              <p className="text-sm text-muted">
                {shop?.shopName} vai confirmar seu horário em breve. Fique de olho no WhatsApp.
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex-col items-start">
                <CardTitle>Agendar horário</CardTitle>
                <CardDescription>Escolha o serviço, a data e o horário.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="booking-service">Serviço</Label>
                    <Select value={serviceId} onValueChange={setServiceId}>
                      <SelectTrigger id="booking-service" aria-label="Selecionar serviço">
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {shop?.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} · {formatCurrencyBRL(service.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="booking-date">Data</Label>
                    <Input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>

                  {serviceId ? (
                    <div>
                      <Label>Horário</Label>
                      {loadingSlots ? (
                        <p className="text-sm text-muted-foreground">Carregando horários…</p>
                      ) : slots.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhum horário livre nesse dia. Tente outra data.
                        </p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={
                                slot === time
                                  ? "rounded-sm border border-accent bg-accent/15 px-2 py-1.5 text-sm text-accent"
                                  : "rounded-sm border border-border-strong px-2 py-1.5 text-sm text-foreground hover:border-accent"
                              }
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div>
                    <Label htmlFor="booking-name">Seu nome</Label>
                    <Input
                      id="booking-name"
                      value={clientName}
                      onChange={(event) => setClientName(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="booking-phone">Seu WhatsApp (com DDD)</Label>
                    <Input
                      id="booking-phone"
                      inputMode="tel"
                      placeholder="(11) 98765-4321"
                      value={clientPhone}
                      onChange={(event) => setClientPhone(formatPhoneBR(event.target.value))}
                    />
                  </div>

                  {error ? (
                    <p role="alert" className="text-sm text-status-canceled">
                      {error}
                    </p>
                  ) : null}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Agendando…" : "Confirmar agendamento"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
