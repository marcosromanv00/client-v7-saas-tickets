import { TheaterEvent, Ticket, SpecialGuestEntry, Seat, BraceletColor } from "./types";
import { TheaterState } from "./ticket-store-types";
import { loadInitialState, STORAGE_KEY } from "./initial-state";
import { logAuditEvent } from "../auth/audit-logger";
import { releaseUnclaimedTicketsForState } from "./ticket-release-utils";
import { findTicketByAnyCode, executeCheckInTicket, executeUndoCheckInTicket } from "./ticket-verification-utils";
import { executeBooking, BookTicketPayload } from "./ticket-booking-handler";
import { executeBatchBooking, BatchBookGroupPayload } from "./batch-booking-handler";
import { theaterSync } from "./sync-channel";

export type { TheaterState } from "./ticket-store-types";

let state: TheaterState = loadInitialState();
const listeners = new Set<() => void>();

function notify(broadcastType?: "TICKET_BOOKED" | "TICKET_CHECKED_IN" | "TICKET_SEATED") {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }
  if (broadcastType) {
    theaterSync.broadcast(broadcastType);
  }
  listeners.forEach((l) => l());
}

// Sincronización multi-pestaña
theaterSync.subscribe(() => {
  state = loadInitialState();
  listeners.forEach((l) => l());
});

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
    const res = executeCheckInTicket(state, ticketId);
    if (res.success && res.updatedState) {
      state = res.updatedState;
      notify("TICKET_CHECKED_IN");
    }
    return { success: res.success, error: res.error, ticket: res.ticket, status: res.status };
  },

  undoCheckInTicket: (ticketId: string): { success: boolean; ticket?: Ticket } => {
    const res = executeUndoCheckInTicket(state, ticketId);
    if (res.success && res.updatedState) {
      state = res.updatedState;
      notify("TICKET_CHECKED_IN");
    }
    return { success: res.success, ticket: res.ticket };
  },

  redeemSpecialGuest: (guestId: string, count: number = 1): { success: boolean; guest?: SpecialGuestEntry } => {
    const guest = state.specialGuests.find((g) => g.id === guestId);
    if (!guest) return { success: false };
    const updatedCount = Math.min(guest.ticketsCount, guest.redeemedCount + count);
    const updated: SpecialGuestEntry = { ...guest, redeemedCount: updatedCount };
    state = {
      ...state,
      specialGuests: state.specialGuests.map((g) => (g.id === guestId ? updated : g)),
    };
    notify("TICKET_CHECKED_IN");
    return { success: true, guest: updated };
  },

  batchBookGroup: (payload: BatchBookGroupPayload) => {
    const { updatedState, result } = executeBatchBooking(state, payload);
    if (result.success) {
      state = updatedState;
      notify("TICKET_CHECKED_IN");
    }
    return result;
  },

  toggleTicketSeated: (ticketId: string): { success: boolean; isSeated: boolean } => {
    const ticket = state.tickets.find((t) => t.id === ticketId);
    if (!ticket) return { success: false, isSeated: false };

    const newSeated = !ticket.isSeated;
    const updated: Ticket = {
      ...ticket,
      isSeated: newSeated,
      seatedAt: newSeated ? new Date().toISOString() : null,
    };

    state = {
      ...state,
      tickets: state.tickets.map((t) => (t.id === ticketId ? updated : t)),
    };
    notify("TICKET_SEATED");
    return { success: true, isSeated: newSeated };
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
