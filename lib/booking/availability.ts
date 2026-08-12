export interface BusySlot {
  time: string; // "HH:mm"
  durationMinutes: number;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(totalMinutes: number) {
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Pure slot-availability calculation, no Next.js/Supabase imports — easy to
 * reason about and reuse from both the availability route and the booking
 * route (which must re-check on submit to avoid a race between two
 * visitors grabbing the same time).
 */
export function computeAvailableSlots(input: {
  businessHoursStart: string;
  businessHoursEnd: string;
  serviceDurationMinutes: number;
  busy: BusySlot[];
  slotStepMinutes?: number;
  /** Minutes since midnight before which slots are hidden (e.g. "now", when booking for today). */
  minStartMinutes?: number;
}): string[] {
  const step = input.slotStepMinutes ?? 30;
  const startMin = toMinutes(input.businessHoursStart);
  const endMin = toMinutes(input.businessHoursEnd);

  const busyRanges = input.busy.map((slot) => {
    const start = toMinutes(slot.time);
    return { start, end: start + slot.durationMinutes };
  });

  const slots: string[] = [];
  for (let t = startMin; t + input.serviceDurationMinutes <= endMin; t += step) {
    if (input.minStartMinutes !== undefined && t < input.minStartMinutes) continue;

    const slotEnd = t + input.serviceDurationMinutes;
    const overlaps = busyRanges.some((busy) => t < busy.end && slotEnd > busy.start);
    if (!overlaps) slots.push(fromMinutes(t));
  }

  return slots;
}

export function isSlotAvailable(input: {
  time: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  serviceDurationMinutes: number;
  busy: BusySlot[];
}): boolean {
  const available = computeAvailableSlots({
    businessHoursStart: input.businessHoursStart,
    businessHoursEnd: input.businessHoursEnd,
    serviceDurationMinutes: input.serviceDurationMinutes,
    busy: input.busy,
  });
  return available.includes(input.time);
}
