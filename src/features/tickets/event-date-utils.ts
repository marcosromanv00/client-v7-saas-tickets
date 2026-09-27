import { TheaterEvent } from "./types";

export function getTodayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function findActiveEventForDate(
  events: TheaterEvent[],
  targetDate: string = getTodayDateString()
): TheaterEvent | undefined {
  if (!events || events.length === 0) return undefined;

  // 1. Coincidencia exacta con la fecha principal de la función
  const exactMatch = events.find((e) => e.date === targetDate);
  if (exactMatch) return exactMatch;

  // 2. Coincidencia con fechas adicionales de temporada
  const multiDateMatch = events.find((e) =>
    e.datesAvailable?.some((d) => d.date === targetDate)
  );
  if (multiDateMatch) return multiDateMatch;

  // 3. Si hoy no hay función programada, seleccionar la función futura más próxima
  const futureEvents = events
    .filter((e) => e.date >= targetDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (futureEvents.length > 0) return futureEvents[0];

  // 4. Fallback al primer evento de la lista
  return events[0];
}

export function getDefaultActiveEventId(
  events: TheaterEvent[],
  targetDate: string = getTodayDateString()
): string {
  const active = findActiveEventForDate(events, targetDate);
  return active ? active.id : (events[0]?.id || "");
}

/**
 * Filtra eventos cuya fecha ya haya pasado y retorna únicamente los próximos N eventos
 */
export function getUpcomingActiveEvents(
  events: TheaterEvent[],
  limit: number = 4,
  targetDate: string = getTodayDateString()
): TheaterEvent[] {
  if (!events || events.length === 0) return [];

  return events
    .filter((e) => e.date >= targetDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

