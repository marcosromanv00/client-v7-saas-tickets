import { TheaterEvent, Ticket, SpecialGuestEntry, Seat, BraceletColor } from "./types";
import { TheaterState } from "./ticket-store-types";
import { loadInitialState, STORAGE_KEY } from "./initial-state";
import { logAuditEvent } from "../auth/audit-logger";
import { releaseUnclaimedTicketsForState } from "./ticket-release-utils";
import { findTicketByAnyCode, evaluateTicketForCheckIn } from "./ticket-verification-utils";
import { executeBooking, BookTicketPayload } from "./ticket-booking-handler";

export type { TheaterState } from "./ticket-store-types";

let state: TheaterState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }
  listeners.forEach((l) => l());
}

export const theaterStore = {
  getSnapshot: (): TheaterState => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  toggleRegistration: (eventId: string, enabled: boolean) => {
    state = {
      ...state,
      events: state.events.map((e) => (e.id === eventId ? { ...e, registrationEnabled: enabled } : e)),
    };
    notify();
  },

  updateEvent: (updated: TheaterEvent) => {
    state = {
      ...state,
      events: state.events.map((e) => (e.id === updated.id ? updated : e)),
    };
    notify();
  },

  setEventBraceletColor: (eventId: string, color: BraceletColor) => {
    state = {
      ...state,
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, braceletColorId: color.id, braceletColorName: color.name, braceletColorHex: color.hex }
          : e
      ),
    };
    notify();
  },

  updateBraceletCatalog: (colors: BraceletColor[]) => {
    state = { ...state, braceletColors: colors };
    notify();
  },

  updateEventSeats: (eventId: string, newSeats: Seat[]) => {
    state = { ...state, seatsByEvent: { ...state.seatsByEvent, [eventId]: newSeats } };
    notify();
  },

  checkAndReleaseUnclaimed: (currentTime: Date = new Date()): number => {
    const { updatedState, releasedCount } = releaseUnclaimedTicketsForState(state, currentTime);
    if (releasedCount > 0) {
      state = updatedState;
      notify();
      logAuditEvent({
        actorId: "system-auto",
        actorName: "Regla 15 Minutos de Aforo",
        actorRole: "PRODUCER",
        action: "TICKET_CHECKIN",
        targetEntity: "sala",
        details: `Corte de 15 min: ${releasedCount} boletos no acreditados liberados para walk-ins`,
      });
    }
    return releasedCount;
  },

  bookTicket: (payload: BookTicketPayload) => {
    const { updatedState, result } = executeBooking(state, payload);
    if (result.success) {
      state = updatedState;
      notify();
    }
    return result;
  },

  checkInTicket: (ticketId: string): { success: boolean; error?: string; ticket?: Ticket; status?: string } => {
    const ticket = state.tickets.find((t) => t.id === ticketId);
    const evaluation = evaluateTicketForCheckIn(ticket || null);

    if (evaluation.status !== "VALID" || !ticket) {
      return { success: false, error: evaluation.message, ticket: ticket || undefined, status: evaluation.status };
    }

    const updated: Ticket = {
      ...ticket,
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      status: "CHECKED_IN",
    };

    const seats = state.seatsByEvent[ticket.eventId] || [];
    if (ticket.seatId) {
      const s = seats.find((seat) => seat.id === ticket.seatId);
      if (s) s.status = "OCCUPIED";
    }

    state = {
      ...state,
      tickets: state.tickets.map((t) => (t.id === ticketId ? updated : t)),
      seatsByEvent: { ...state.seatsByEvent, [ticket.eventId]: [...seats] },
    };
    notify();
    return { success: true, ticket: updated, status: "VALID" };
  },

  checkInByCode: (code: string): { success: boolean; error?: string; ticket?: Ticket; status?: string } => {
    const ticket = findTicketByAnyCode(state.tickets, code);
    if (!ticket) {
      return { success: false, error: `Código "${code}" no encontrado en la base de datos.`, status: "NOT_FOUND" };
    }
    return theaterStore.checkInTicket(ticket.id);
  },

  checkInByQr: (qrValue: string) => theaterStore.checkInByCode(qrValue),

  addSpecialGuest: (guest: SpecialGuestEntry) => {
    state = { ...state, specialGuests: [guest, ...state.specialGuests] };
    notify();
  },

  resetStore: () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
    state = loadInitialState();
    notify();
  },
};
