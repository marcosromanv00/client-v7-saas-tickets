import { describe, it, expect, beforeEach } from "vitest";
import { theaterStore } from "../tickets/ticket-store";
import { buildAttendeeList, computeAttendeeMetrics } from "./attendee-utils";

describe("Attendee Verification Flow (Integración de Puerta)", () => {
  beforeEach(() => {
    theaterStore.resetStore();
  });

  it("permite acreditar con 1 clic y luego deshacer correctamente", () => {
    const state = theaterStore.getSnapshot();
    const event = state.events[0];
    const tickets = state.tickets.filter((t) => t.eventId === event.id);
    const pendingTicket = tickets.find((t) => !t.checkedIn && t.status === "ACTIVE");

    expect(pendingTicket).toBeDefined();
    if (!pendingTicket) return;

    // 1. Acreditar ticket
    const checkInRes = theaterStore.checkInTicket(pendingTicket.id);
    expect(checkInRes.success).toBe(true);
    expect(checkInRes.ticket?.checkedIn).toBe(true);
    expect(checkInRes.ticket?.status).toBe("CHECKED_IN");

    // Verificar butaca ocupada
    const stateAfterCheckIn = theaterStore.getSnapshot();
    if (pendingTicket.seatId) {
      const seat = stateAfterCheckIn.seatsByEvent[event.id]?.find((s) => s.id === pendingTicket.seatId);
      expect(seat?.status).toBe("OCCUPIED");
    }

    // 2. Deshacer acreditación
    const undoRes = theaterStore.undoCheckInTicket(pendingTicket.id);
    expect(undoRes.success).toBe(true);
    expect(undoRes.ticket?.checkedIn).toBe(false);
    expect(undoRes.ticket?.status).toBe("ACTIVE");

    // Verificar butaca restaurada a RESERVED
    const stateAfterUndo = theaterStore.getSnapshot();
    if (pendingTicket.seatId) {
      const restoredSeat = stateAfterUndo.seatsByEvent[event.id]?.find((s) => s.id === pendingTicket.seatId);
      expect(restoredSeat?.status).toBe("RESERVED");
    }
  });

  it("acredita cupos de delegaciones protocolares", () => {
    const state = theaterStore.getSnapshot();
    const guest = state.specialGuests[0];
    expect(guest).toBeDefined();

    const initialRedeemed = guest.redeemedCount;
    const redeemRes = theaterStore.redeemSpecialGuest(guest.id, 1);
    expect(redeemRes.success).toBe(true);
    expect(redeemRes.guest?.redeemedCount).toBe(initialRedeemed + 1);
  });

  it("registra un asistente in-situ y lo acredita de inmediato", () => {
    const state = theaterStore.getSnapshot();
    const event = state.events[0];

    const bookRes = theaterStore.bookTicket({
      eventId: event.id,
      citizenName: "Don Carlos Solano",
      citizenId: "1-0555-0888",
      seatId: null,
      zone: "PLATEA_BAJA",
      isVipGuest: true,
    });

    expect(bookRes.success).toBe(true);
    expect(bookRes.ticket).toBeDefined();

    if (bookRes.ticket) {
      const checkInRes = theaterStore.checkInTicket(bookRes.ticket.id);
      expect(checkInRes.success).toBe(true);
      expect(checkInRes.ticket?.checkedIn).toBe(true);
    }
  });

  it("calcula métricas reactivas tras múltiples ingresos", () => {
    const state = theaterStore.getSnapshot();
    const event = state.events[0];
    const tickets = state.tickets.filter((t) => t.eventId === event.id);
    const guests = state.specialGuests.filter((g) => g.eventId === event.id);

    const list = buildAttendeeList(tickets, guests);
    const metrics = computeAttendeeMetrics(list, event.totalCapacity);

    expect(metrics.totalExpected).toBeGreaterThan(0);
    expect(metrics.pendingCount + metrics.checkedInCount).toBe(metrics.totalExpected);
  });
});
