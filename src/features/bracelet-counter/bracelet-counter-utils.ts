import { BraceletLogItem, BraceletMetrics, CapacityAlertLevel } from "./bracelet-counter-types";

export function calculateBraceletMetrics(
  totalCapacity: number,
  deliveredCount: number
): BraceletMetrics {
  const safeCapacity = Math.max(1, totalCapacity);
  const safeDelivered = Math.max(0, deliveredCount);
  const availableRemaining = Math.max(0, safeCapacity - safeDelivered);
  const percentageOccupied = Math.min(100, Math.round((safeDelivered / safeCapacity) * 100));

  let status: CapacityAlertLevel = "AVAILABLE";
  let statusLabel = "Aforo Fluido";

  if (safeDelivered >= safeCapacity) {
    status = "FULL";
    statusLabel = "Aforo Completo (Sala Llena)";
  } else if (percentageOccupied >= 80 || availableRemaining <= 25) {
    status = "WARNING";
    statusLabel = `Atención: Últimos ${availableRemaining} espacios`;
  }

  return {
    totalCapacity: safeCapacity,
    deliveredCount: safeDelivered,
    availableRemaining,
    percentageOccupied,
    status,
    statusLabel,
  };
}

export function applyBraceletDelta(
  currentCount: number,
  delta: number,
  maxCapacity: number
): { nextCount: number; appliedDelta: number; isFull: boolean } {
  const safeCurrent = Math.max(0, currentCount);
  const candidate = safeCurrent + delta;

  if (delta > 0 && safeCurrent >= maxCapacity) {
    return { nextCount: safeCurrent, appliedDelta: 0, isFull: true };
  }

  // Si suma más de lo que cabe, recortar al máximo disponible
  const nextCount = Math.max(0, Math.min(candidate, maxCapacity));
  const appliedDelta = nextCount - safeCurrent;
  const isFull = nextCount >= maxCapacity;

  return { nextCount, appliedDelta, isFull };
}

export function createBraceletLogItem(
  eventId: string,
  delta: number,
  totalAfter: number,
  notes?: string
): BraceletLogItem {
  return {
    id: `bc-log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    delta,
    totalAfter,
    timestamp: new Date().toISOString(),
    notes,
  };
}

export function formatTimeShort(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "";
  }
}
