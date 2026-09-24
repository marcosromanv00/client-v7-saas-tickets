import { Ticket } from "./types";

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
