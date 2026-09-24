import { Ticket, ZoneId } from "./types";
import { generateInitialSeats } from "./theater-layout";
import { TheaterState } from "./ticket-store-types";
import { generateShortCode } from "./bracelet-utils";

export interface BookTicketPayload {
  eventId: string;
  citizenName: string;
  citizenId: string;
  citizenPhone?: string;
  citizenEmail?: string;
  seatId: string | null;
  zone: ZoneId;
  isVipGuest?: boolean;
  notes?: string;
}

export interface BookingResult {
  success: boolean;
  ticket?: Ticket;
  error?: string;
}

export function executeBooking(
  state: TheaterState,
  payload: BookTicketPayload
): { updatedState: TheaterState; result: BookingResult } {
  const activeUserTickets = state.tickets.filter(
    (t) =>
      t.eventId === payload.eventId &&
      t.citizenId.trim().toLowerCase() === payload.citizenId.trim().toLowerCase() &&
      t.status !== "RELEASED_NO_SHOW" &&
      t.status !== "CANCELLED"
  );

  if (activeUserTickets.length >= 2 && !payload.notes?.includes("Protocolo")) {
    return {
      updatedState: state,
      result: {
        success: false,
        error: `La cédula ${payload.citizenId} ya cuenta con el límite máximo de 2 entradas para este evento.`,
      },
    };
  }

  const event = state.events.find((e) => e.id === payload.eventId);
  if (!event) {
    return {
      updatedState: state,
      result: { success: false, error: "Evento no encontrado." },
    };
  }

  let seatLabel: string | null = null;
  const currentSeats = state.seatsByEvent[payload.eventId] || generateInitialSeats();

  if (payload.seatId) {
    const seat = currentSeats.find((s) => s.id === payload.seatId);
    if (!seat || seat.status !== "AVAILABLE") {
      return {
        updatedState: state,
        result: { success: false, error: "La butaca seleccionada ya no está disponible." },
      };
    }
    seat.status = "RESERVED";
    seatLabel = seat.label;
  }

  const existingShortCodes = new Set(state.tickets.map((t) => t.shortCode).filter(Boolean));
  const shortCode = generateShortCode(existingShortCodes);

  const newTicket: Ticket = {
    id: `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId: payload.eventId,
    citizenName: payload.citizenName.trim(),
    citizenId: payload.citizenId.trim(),
    citizenPhone: payload.citizenPhone?.trim(),
    citizenEmail: payload.citizenEmail?.trim(),
    seatId: payload.seatId,
    seatLabel,
    zone: payload.zone,
    qrCodeValue: `TM-${payload.eventId}-${payload.seatId || payload.zone}-${payload.citizenId.trim()}`,
    shortCode,
    isVipGuest: !!payload.isVipGuest,
    checkedIn: false,
    checkedInAt: null,
    isSeated: false,
    seatedAt: null,
    status: "ACTIVE",
    releasedAt: null,
    createdAt: new Date().toISOString(),
    notes: payload.notes,
  };

  const updatedState: TheaterState = {
    ...state,
    tickets: [newTicket, ...state.tickets],
    seatsByEvent: { ...state.seatsByEvent, [payload.eventId]: [...currentSeats] },
  };

  return {
    updatedState,
    result: { success: true, ticket: newTicket },
  };
}
