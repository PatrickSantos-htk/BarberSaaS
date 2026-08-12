import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPhoneBR(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatDateBR(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

const WEEKDAYS_PT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const BRASILIA_TZ = "America/Sao_Paulo";

/**
 * A Date whose getFullYear/getMonth/getDate/getHours read as Brasília wall-clock
 * time, regardless of the browser/server's own timezone. Barbershop hours and
 * "today" must always mean Brasília's today, not the visitor's or host's.
 */
export function nowInBrasilia() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: BRASILIA_TZ }));
}

export function todayISO() {
  return toISODate(nowInBrasilia());
}

export function formatTimeBR() {
  return new Date().toLocaleTimeString("pt-BR", {
    timeZone: BRASILIA_TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWeekdayShortPT(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return WEEKDAYS_PT[date.getDay()];
}

export function formatDayMonthPT(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]}`;
}

export function addDays(isoDate: string, amount: number) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function startOfWeek(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  return toISODate(date);
}

export function currentMonthKey() {
  return todayISO().slice(0, 7);
}

export function monthKeyOf(isoDate: string) {
  return isoDate.slice(0, 7);
}

export function addMonths(monthKey: string, amount: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabelPT(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTHS_PT[month - 1]} de ${year}`;
}

export function formatMonthShortPT(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTHS_PT[month - 1].slice(0, 3)}/${String(year).slice(2)}`;
}
