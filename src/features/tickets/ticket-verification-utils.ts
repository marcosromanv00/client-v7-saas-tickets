import { Ticket } from "./types";
import { TheaterState } from "./ticket-store-types";

export type VerificationStatus =
  | "VALID"
  | "ALREADY_CHECKED_IN"
  | "RELEASED_NO_SHOW"
  | "NOT_FOUND";

export interface VerificationCheckResult {
  status: VerificationStatus;
  ticket: Ticket | null;
  message?: string;
}

export interface CheckInExecutionResult {
  success: boolean;
  error?: string;
  ticket?: Ticket;
  status?: string;
  updatedState?: TheaterState;
}

export interface UndoCheckInExecutionResult {
  success: boolean;
  ticket?: Ticket;
  updatedState?: TheaterState;
}

export function findTicketByAnyCode(tickets: Ticket[], rawCode: string): Ticket | null {
  const code = rawCode.trim();
  if (!code) return null;
  const upper = code.toUpperCase();

  return (
    tickets.find(
      (t) =>
        t.qrCodeValue.trim() === code ||
        (t.shortCode && t.shortCode.trim().toUpperCase() === upper) ||
        t.id.trim() === code
    ) || null
  );
}

export function evaluateTicketForCheckIn(ticket: Ticket | null): VerificationCheckResult {
  if (!ticket) {
    return {
      status: "NOT_FOUND",
      ticket: null,
      message: "Código no encontrado en el sistema.",
    };
  }

  if (ticket.status === "RELEASED_NO_SHOW") {
    return {
      status: "RELEASED_NO_SHOW",
      ticket,
      message:
        "Entrada liberada por inasistencia. La butaca fue reasignada al no registrarse al menos 15 minutos antes de la función.",
    };
  }

  if (ticket.checkedIn) {
    const timeStr = ticket.checkedInAt
      ? new Date(ticket.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "anteriormente";
    return {
      status: "ALREADY_CHECKED_IN",
      ticket,
      message: `El tiquete ya ingresó a las ${timeStr}.`,
    };
  }

  return {
    status: "VALID",
    ticket,
  };
}

export function executeCheckInTicket(state: TheaterState, ticketId: string): CheckInExecutionResult {
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
  const updatedSeats = seats.map((s) => (s.id === ticket.seatId ? { ...s, status: "OCCUPIED" as const } : s));

  const updatedState: TheaterState = {
    ...state,
    tickets: state.tickets.map((t) => (t.id === ticketId ? updated : t)),
    seatsByEvent: { ...state.seatsByEvent, [ticket.eventId]: updatedSeats },
  };

  return { success: true, ticket: updated, status: "VALID", updatedState };
}

export function executeUndoCheckInTicket(state: TheaterState, ticketId: string): UndoCheckInExecutionResult {
  const ticket = state.tickets.find((t) => t.id === ticketId);
  if (!ticket || !ticket.checkedIn) {
    return { success: false };
  }

  const updated: Ticket = {
    ...ticket,
    checkedIn: false,
    checkedInAt: null,
    status: "ACTIVE",
  };

  const seats = state.seatsByEvent[ticket.eventId] || [];
  const updatedSeats = seats.map((s) => (s.id === ticket.seatId && s.status === "OCCUPIED" ? { ...s, status: "RESERVED" as const } : s));

  const updatedState: TheaterState = {
    ...state,
    tickets: state.tickets.map((t) => (t.id === ticketId ? updated : t)),
    seatsByEvent: { ...state.seatsByEvent, [ticket.eventId]: updatedSeats },
  };

  return { success: true, ticket: updated, updatedState };
}
