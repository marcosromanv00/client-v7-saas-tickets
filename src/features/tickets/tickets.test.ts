import { describe, it, expect, beforeEach } from "vitest";
import { generateInitialSeats, calculateSeatStats } from "./theater-layout";
import { theaterStore } from "./ticket-store";
import { INITIAL_EVENTS } from "./mock-data";
import { findNextBestAvailableSeat } from "./hybrid-seating-utils";
import { isEventWithinReleaseWindow } from "./ticket-release-utils";

describe("Teatro Municipal - Sistema de Tiquetería y Aforo", () => {
  beforeEach(() => {
    theaterStore.resetStore();
  });

  describe("1. Distribución Espacial del Teatro (220 Butacas Oficiales)", () => {
    it("debe generar exactamente 220 butacas (62 Platea Baja, 96 Nivel Medio y 62 Balcón)", () => {
      const seats = generateInitialSeats(["A"], ["K"]);
      expect(seats.length).toBe(220);

      const pbSeats = seats.filter((s) => s.zone === "PLATEA_BAJA");
      const nmSeats = seats.filter((s) => s.zone === "NIVEL_MEDIO");
      const balconSeats = seats.filter((s) => s.zone === "BALCON_ALTO");

      expect(pbSeats.length).toBe(62);
      expect(nmSeats.length).toBe(96);
      expect(balconSeats.length).toBe(62);
    });

    it("debe marcar correctamente las filas VIP de protocolo (Fila A y Fila K)", () => {
      const seats = generateInitialSeats(["A"], ["K"]);
      const filaA = seats.filter((s) => s.row === "A");
      const filaK = seats.filter((s) => s.row === "K");
      const filaB = seats.filter((s) => s.row === "B");

      expect(filaA.every((s) => s.isVip)).toBe(true);
      expect(filaK.every((s) => s.isVip)).toBe(true);
      expect(filaB.every((s) => !s.isVip)).toBe(true);
    });

    it("debe calcular estadísticas de butacas correctamente", () => {
      const seats = generateInitialSeats(["A"], ["K"]);
      const stats = calculateSeatStats(seats);

      expect(stats.total).toBe(220);
      expect(stats.available).toBe(220);
      expect(stats.vip).toBe(26);
    });
  });

  describe("2. Regla de Límite de 2 Entradas por Usuario y Código Rápido (2L2D)", () => {
    it("debe permitir emitir hasta 2 entradas para la misma cédula y bloquear la tercera", () => {
      const eventId = INITIAL_EVENTS[1].id;
      const citizenId = "1-0999-0888";

      const t1 = theaterStore.bookTicket({
        eventId,
        citizenName: "Marcos Montero",
        citizenId,
        seatId: "PB-D-01",
        zone: "PLATEA_BAJA",
      });
      expect(t1.success).toBe(true);
      expect(t1.ticket?.shortCode).toMatch(/^[A-Z]{2}[0-9]{2}$/);

      const t2 = theaterStore.bookTicket({
        eventId,
        citizenName: "Marcos Montero",
        citizenId,
        seatId: "PB-D-02",
        zone: "PLATEA_BAJA",
      });
      expect(t2.success).toBe(true);
      expect(t2.ticket?.shortCode).toMatch(/^[A-Z]{2}[0-9]{2}$/);

      const t3 = theaterStore.bookTicket({
        eventId,
        citizenName: "Marcos Montero",
        citizenId,
        seatId: "PB-D-03",
        zone: "PLATEA_BAJA",
      });
      expect(t3.success).toBe(false);
      expect(t3.error).toContain("límite máximo de 2 entradas");
    });

    it("debe permitir check-in por código rápido de 4 caracteres y rechazar duplicados", () => {
      const eventId = INITIAL_EVENTS[1].id;

      const booking = theaterStore.bookTicket({
        eventId,
        citizenName: "Valeria Prado",
        citizenId: "1-0555-0444",
        seatId: "PB-D-05",
        zone: "PLATEA_BAJA",
      });
      expect(booking.success).toBe(true);
      const shortCode = booking.ticket!.shortCode;

      // Validación rápida con los 4 caracteres
      const check1 = theaterStore.checkInByCode(shortCode);
      expect(check1.success).toBe(true);
      expect(check1.ticket?.checkedIn).toBe(true);

      // Segundo intento de check-in debe fallar
      const check2 = theaterStore.checkInByCode(shortCode);
      expect(check2.success).toBe(false);
      expect(check2.error).toContain("ya ingresó");
    });
  });

  describe("3. Liberación a 15 Minutos y Acomodo Híbrido", () => {
    it("debe detectar la ventana de 15 minutos o menos respecto a la hora del evento", () => {
      // Evento a las 19:00 del 2026-09-26
      const eventDate = "2026-09-26";
      const eventTime = "19:00";

      // 18:40 (faltan 20 min) -> No entra en ventana
      const time20MinBefore = new Date(2026, 8, 26, 18, 40, 0);
      expect(isEventWithinReleaseWindow(eventDate, eventTime, 15, time20MinBefore)).toBe(false);

      // 18:45 (faltan 15 min exactos) -> Entra en ventana
      const time15MinBefore = new Date(2026, 8, 26, 18, 45, 0);
      expect(isEventWithinReleaseWindow(eventDate, eventTime, 15, time15MinBefore)).toBe(true);

      // 18:50 (faltan 10 min) -> Entra en ventana
      const time10MinBefore = new Date(2026, 8, 26, 18, 50, 0);
      expect(isEventWithinReleaseWindow(eventDate, eventTime, 15, time10MinBefore)).toBe(true);
    });

    it("debe liberar butacas de tiquetes no registrados a los 15 minutos", () => {
      const event = INITIAL_EVENTS[1]; // 2026-09-26 19:00
      const booking = theaterStore.bookTicket({
        eventId: event.id,
        citizenName: "Jorge Ramos",
        citizenId: "1-0111-0222",
        seatId: "PB-B-03",
        zone: "PLATEA_BAJA",
      });
      expect(booking.success).toBe(true);

      // Simular reloj a las 18:50 (faltan 10 min para el evento)
      const simulatedClock = new Date(2026, 8, 26, 18, 50, 0);
      const released = theaterStore.checkAndReleaseUnclaimed(simulatedClock);
      expect(released).toBeGreaterThanOrEqual(1);

      // El tiquete pasa a RELEASED_NO_SHOW y la butaca se libera a AVAILABLE
      const snapshot = theaterStore.getSnapshot();
      const updatedTkt = snapshot.tickets.find((t) => t.id === booking.ticket!.id);
      expect(updatedTkt?.status).toBe("RELEASED_NO_SHOW");

      const seat = snapshot.seatsByEvent[event.id]?.find((s) => s.id === "PB-B-03");
      expect(seat?.status).toBe("AVAILABLE");

      // Si intenta ingresar después, se le rechaza indicando liberación
      const scanAfterRelease = theaterStore.checkInByCode(booking.ticket!.shortCode);
      expect(scanAfterRelease.success).toBe(false);
      expect(scanAfterRelease.error).toContain("liberada por inasistencia");
    });

    it("debe asignar la siguiente mejor butaca disponible de frente hacia atrás en acomodo híbrido", () => {
      const seats = generateInitialSeats(["A"], ["K"]);
      // Asiento disponible más al frente debería ser en fila A
      const best1 = findNextBestAvailableSeat(seats);
      expect(best1?.row).toBe("A");
      expect(best1?.number).toBe(1);

      // Ocupamos toda la fila A
      seats.forEach((s) => {
        if (s.row === "A") s.status = "OCCUPIED";
      });

      // El siguiente mejor asiento disponible debe ser de la fila B
      const best2 = findNextBestAvailableSeat(seats);
      expect(best2?.row).toBe("B");
      expect(best2?.number).toBe(1);
    });
  });
});
