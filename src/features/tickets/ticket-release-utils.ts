import { TheaterState } from "./ticket-store-types";

/**
 * Evalúa si un evento se encuentra a 15 minutos o menos de su inicio (o ya inició)
 * según el reloj real del sistema.
 */
export function isEventWithinReleaseWindow(
  eventDate: string,
  eventTime: string,
  windowMinutes: number = 15,
  currentTime: Date = new Date()
): boolean {
  try {
    const [hours, minutes] = eventTime.split(":").map(Number);
    const [year, month, day] = eventDate.split("-").map(Number);
    const eventStart = new Date(year, month - 1, day, hours, minutes, 0);

    const diffMs = eventStart.getTime() - currentTime.getTime();
    const windowMs = windowMinutes * 60 * 1000;

    // A falta de 15 minutos o menos de la hora del evento
    return diffMs <= windowMs;
  } catch {
    return false;
  }
}

/**
 * Libera en bloque todos los tiquetes de eventos que están a 15 minutos o menos
 * que no hayan sido acreditados (checkedIn === false y status === "ACTIVE").
 * Restaura las butacas asociadas a estado "AVAILABLE".
 */
export function releaseUnclaimedTicketsForState(
  state: TheaterState,
  currentTime: Date = new Date()
): { updatedState: TheaterState; releasedCount: number } {
  let releasedCount = 0;
  const newSeatsByEvent = { ...state.seatsByEvent };
  const updatedTickets = [...state.tickets];

  for (const evt of state.events) {
    if (!isEventWithinReleaseWindow(evt.date, evt.time, 15, currentTime)) {
      continue;
    }

    const seatsForEvent = newSeatsByEvent[evt.id] ? [...newSeatsByEvent[evt.id]] : [];
    let seatsModified = false;

    for (let i = 0; i < updatedTickets.length; i++) {
      const t = updatedTickets[i];
      if (t.eventId === evt.id && !t.checkedIn && t.status === "ACTIVE") {
        updatedTickets[i] = {
          ...t,
          status: "RELEASED_NO_SHOW",
          releasedAt: currentTime.toISOString(),
        };
        releasedCount++;

        if (t.seatId) {
          const seat = seatsForEvent.find((s) => s.id === t.seatId);
          if (seat && seat.status === "RESERVED") {
            seat.status = "AVAILABLE";
            seatsModified = true;
          }
        }
      }
    }

    if (seatsModified) {
      newSeatsByEvent[evt.id] = seatsForEvent;
    }
  }

  if (releasedCount === 0) {
    return { updatedState: state, releasedCount: 0 };
  }

  return {
    updatedState: {
      ...state,
      tickets: updatedTickets,
      seatsByEvent: newSeatsByEvent,
    },
    releasedCount,
  };
}
