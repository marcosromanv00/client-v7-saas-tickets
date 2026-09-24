import { TheaterEvent, Ticket, SpecialGuestEntry, ZoneId, Seat } from "./types";
import { generateInitialSeats } from "./theater-layout";
import { TheaterState } from "./ticket-store-types";
import { loadInitialState, STORAGE_KEY } from "./initial-state";
import { logAuditEvent } from "../auth/audit-logger";

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
    logAuditEvent({
      actorId: "usr-admin",
      actorName: "Consola Administrativa",
      actorRole: "PRODUCER",
      action: "EVENT_CONFIG_UPDATED",
      targetEntity: eventId,
      details: enabled ? "Registros públicos habilitados" : "Registros públicos pausados",
    });
  },

  updateEvent: (updated: TheaterEvent) => {
    state = {
      ...state,
      events: state.events.map((e) => (e.id === updated.id ? updated : e)),
    };
    notify();
    logAuditEvent({
      actorId: "usr-admin",
      actorName: "Consola Administrativa",
      actorRole: "PRODUCER",
      action: "EVENT_CONFIG_UPDATED",
      targetEntity: updated.id,
      details: `Parámetros de evento actualizados: ${updated.title}`,
    });
  },

  updateEventSeats: (eventId: string, newSeats: Seat[]) => {
    state = { ...state, seatsByEvent: { ...state.seatsByEvent, [eventId]: newSeats } };
    notify();
    logAuditEvent({
      actorId: "usr-admin",
      actorName: "Consola Administrativa",
      actorRole: "PRODUCER",
      action: "EVENT_CONFIG_UPDATED",
      targetEntity: eventId,
      details: `Matriz de sala actualizada (${newSeats.length} butacas)`,
    });
  },

  bookTicket: (payload: {
    eventId: string;
    citizenName: string;
    citizenId: string;
    citizenPhone?: string;
    seatId: string | null;
    zone: ZoneId;
    isVipGuest?: boolean;
    notes?: string;
  }): { success: boolean; ticket?: Ticket; error?: string } => {
    const existing = state.tickets.find(
      (t) => t.eventId === payload.eventId && t.citizenId.trim().toLowerCase() === payload.citizenId.trim().toLowerCase()
    );
    if (existing && !payload.notes?.includes("Protocolo")) {
      return { success: false, error: `La cédula ${payload.citizenId} ya cuenta con el tiquete ${existing.id.slice(0, 8)} para este evento.` };
    }

    const event = state.events.find((e) => e.id === payload.eventId);
    if (!event) return { success: false, error: "Evento no encontrado." };

    let seatLabel: string | null = null;
    const currentSeats = state.seatsByEvent[payload.eventId] || generateInitialSeats();

    if (payload.seatId) {
      const seat = currentSeats.find((s) => s.id === payload.seatId);
      if (!seat || seat.status !== "AVAILABLE") {
        return { success: false, error: "La butaca seleccionada ya no está disponible." };
      }
      seat.status = "RESERVED";
      seatLabel = seat.label;
    }

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId: payload.eventId,
      citizenName: payload.citizenName.trim(),
      citizenId: payload.citizenId.trim(),
      citizenPhone: payload.citizenPhone?.trim(),
      seatId: payload.seatId,
      seatLabel,
      zone: payload.zone,
      qrCodeValue: `TM-${payload.eventId}-${payload.seatId || payload.zone}-${payload.citizenId.trim()}`,
      isVipGuest: !!payload.isVipGuest,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date().toISOString(),
      notes: payload.notes,
    };

    state = {
      ...state,
      tickets: [newTicket, ...state.tickets],
      seatsByEvent: {
        ...state.seatsByEvent,
        [payload.eventId]: [...currentSeats],
      },
    };
    notify();
    logAuditEvent({
      actorId: "public-system",
      actorName: payload.citizenName,
      actorRole: "CITIZEN",
      action: "TICKET_BOOKED",
      targetEntity: newTicket.id,
      details: `Boleto emitido para ${payload.citizenName} (Cédula: ${payload.citizenId}) en ${newTicket.seatLabel || newTicket.zone}`,
    });
    return { success: true, ticket: newTicket };
  },

  checkInTicket: (ticketId: string): { success: boolean; error?: string; ticket?: Ticket } => {
    const ticket = state.tickets.find((t) => t.id === ticketId);
    if (!ticket) return { success: false, error: "Tiquete no encontrado." };
    if (ticket.checkedIn) {
      return { success: false, error: `El tiquete ya ingresó a las ${new Date(ticket.checkedInAt || "").toLocaleTimeString()}.` };
    }

    const updated: Ticket = {
      ...ticket,
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
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
    logAuditEvent({
      actorId: "staff-gate",
      actorName: "Control de Acceso Puerta",
      actorRole: "DELEGATED_ADMIN",
      action: "TICKET_CHECKIN",
      targetEntity: ticketId,
      details: `Acceso confirmado a sala: ${ticket.citizenName} (Butaca: ${ticket.seatLabel || ticket.zone})`,
    });
    return { success: true, ticket: updated };
  },

  checkInByQr: (qrValue: string): { success: boolean; error?: string; ticket?: Ticket } => {
    const ticket = state.tickets.find((t) => t.qrCodeValue.trim() === qrValue.trim());
    if (!ticket) return { success: false, error: "Código QR no reconocido en el sistema." };
    return theaterStore.checkInTicket(ticket.id);
  },

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
