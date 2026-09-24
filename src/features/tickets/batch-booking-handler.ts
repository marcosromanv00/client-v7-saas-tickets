import { Ticket, Seat } from "./types";
import { TheaterState } from "./ticket-store-types";
import { generateShortCode } from "./bracelet-utils";
import { generateInitialSeats } from "./theater-layout";

export interface BatchBookGroupPayload {
  eventId: string;
  leaderName: string;
  leaderId: string;
  seatIds: string[];
  notes?: string;
}

export interface BatchBookingResult {
  success: boolean;
  tickets?: Ticket[];
  error?: string;
}

/**
 * Emite en lote N tiquetes para un grupo bajo la misma cédula del titular,
 * con check-in automático y marcado de butacas como OCCUPIED.
 */
export function executeBatchBooking(
  state: TheaterState,
  payload: BatchBookGroupPayload
): { updatedState: TheaterState; result: BatchBookingResult } {
  const { eventId, leaderName, leaderId, seatIds } = payload;
  const currentSeats = state.seatsByEvent[eventId] || generateInitialSeats();
  const seatsCopy: Seat[] = currentSeats.map((s) => ({ ...s }));

  const event = state.events.find((e) => e.id === eventId);
  if (!event) {
    return { updatedState: state, result: { success: false, error: "Evento no encontrado." } };
  }

  // Verificar que todas las butacas existan y estén libres
  for (const sId of seatIds) {
    const s = seatsCopy.find((seat) => seat.id === sId);
    if (!s || s.status !== "AVAILABLE") {
      return {
        updatedState: state,
        result: {
          success: false,
          error: `La butaca ${s?.label || sId} no está disponible.`,
        },
      };
    }
  }

  const existingShortCodes = new Set(state.tickets.map((t) => t.shortCode).filter(Boolean));
  const newTickets: Ticket[] = [];
  const now = new Date().toISOString();
  const count = seatIds.length;

  for (let i = 0; i < count; i++) {
    const sId = seatIds[i];
    const seatObj = seatsCopy.find((s) => s.id === sId)!;
    seatObj.status = "OCCUPIED";

    const shortCode = generateShortCode(existingShortCodes);
    existingShortCodes.add(shortCode);

    const displayName = count > 1 ? `${leaderName.trim()} (${i + 1}/${count})` : leaderName.trim();

    const t: Ticket = {
      id: `tkt-group-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
      eventId,
      citizenName: displayName,
      citizenId: leaderId.trim(),
      seatId: sId,
      seatLabel: seatObj.label,
      zone: seatObj.zone,
      qrCodeValue: `TM-${eventId}-${sId}-${leaderId.trim()}`,
      shortCode,
      isVipGuest: seatObj.isVip,
      checkedIn: true,
      checkedInAt: now,
      isSeated: false,
      seatedAt: null,
      status: "CHECKED_IN",
      releasedAt: null,
      createdAt: now,
      notes: payload.notes || `Grupo presencial (${count} pax) emitido en Taquilla`,
    };

    newTickets.push(t);
  }

  const updatedState: TheaterState = {
    ...state,
    tickets: [...newTickets, ...state.tickets],
    seatsByEvent: {
      ...state.seatsByEvent,
      [eventId]: seatsCopy,
    },
  };

  return {
    updatedState,
    result: {
      success: true,
      tickets: newTickets,
    },
  };
}
