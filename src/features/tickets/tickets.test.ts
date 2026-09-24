import { describe, it, expect, beforeEach } from "vitest";
import { generateInitialSeats, calculateSeatStats } from "./theater-layout";
import { computeDynamicCapacity } from "./capacity-calculator";
import { theaterStore } from "./ticket-store";
import { INITIAL_EVENTS } from "./mock-data";

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
      expect(stats.vip).toBe(26); // 14 en fila A + 12 en fila K = 26 butacas VIP
    });
  });

  describe("2. Cálculo de Aforo Dinámico (Pre-reservas vs Ingresos)", () => {
    it("debe calcular remanente para walk-ins contrastando reservas previas", () => {
      const event = INITIAL_EVENTS[0];
      const seats = generateInitialSeats(event.vipRowsPlantaBaja, event.vipRowsBalcon);
      const tickets = [
        {
          id: "t-1",
          eventId: event.id,
          citizenName: "Ana Gómez",
          citizenId: "1-1234-5678",
          seatId: "PB-B-01",
          seatLabel: "Platea B-01",
          zone: "PLANTA_BAJA" as const,
          qrCodeValue: "QR-1",
          isVipGuest: false,
          checkedIn: true,
          checkedInAt: "2026-09-25T18:00:00Z",
          createdAt: "2026-09-23T10:00:00Z",
        },
        {
          id: "t-2",
          eventId: event.id,
          citizenName: "Carlos Ruiz",
          citizenId: "1-9876-5432",
          seatId: "PB-B-02",
          seatLabel: "Platea B-02",
          zone: "PLANTA_BAJA" as const,
          qrCodeValue: "QR-2",
          isVipGuest: false,
          checkedIn: false,
          checkedInAt: null,
          createdAt: "2026-09-23T10:00:00Z",
        },
      ];

      const report = computeDynamicCapacity(event, tickets, [], seats);

      expect(report.totalCapacity).toBe(220);
      expect(report.preReservedCount).toBe(2);
      expect(report.checkedInCount).toBe(1);
      expect(report.availableRemaining).toBe(218);
    });
  });

  describe("3. Reglas de Negocio en Emisión y Check-in", () => {
    it("debe prevenir que la misma cédula registre múltiples tiquetes en un mismo evento", () => {
      const eventId = INITIAL_EVENTS[1].id;

      const firstBooking = theaterStore.bookTicket({
        eventId,
        citizenName: "Marcos Montero",
        citizenId: "1-0999-0888",
        seatId: "PB-D-01",
        zone: "PLANTA_BAJA",
      });
      expect(firstBooking.success).toBe(true);

      const secondBooking = theaterStore.bookTicket({
        eventId,
        citizenName: "Marcos Montero",
        citizenId: "1-0999-0888",
        seatId: "PB-D-02",
        zone: "PLANTA_BAJA",
      });
      expect(secondBooking.success).toBe(false);
      expect(secondBooking.error).toContain("ya cuenta con el tiquete");
    });

    it("debe permitir check-in por QR e impedir doble ingreso con el mismo QR", () => {
      const eventId = INITIAL_EVENTS[1].id;

      const booking = theaterStore.bookTicket({
        eventId,
        citizenName: "Valeria Prado",
        citizenId: "1-0555-0444",
        seatId: "PB-D-05",
        zone: "PLANTA_BAJA",
      });
      expect(booking.success).toBe(true);
      const qrCode = booking.ticket!.qrCodeValue;

      // Primer escaneo exitoso
      const scan1 = theaterStore.checkInByQr(qrCode);
      expect(scan1.success).toBe(true);
      expect(scan1.ticket?.checkedIn).toBe(true);

      // Segundo intento de escaneo debe ser rechazado
      const scan2 = theaterStore.checkInByQr(qrCode);
      expect(scan2.success).toBe(false);
      expect(scan2.error).toContain("ya ingresó");
    });
  });
});
