import { describe, it, expect } from "vitest";
import {
  calculateBraceletMetrics,
  applyBraceletDelta,
  createBraceletLogItem,
} from "./bracelet-counter-utils";

describe("bracelet-counter-utils", () => {
  describe("calculateBraceletMetrics", () => {
    it("calcula correctamente el aforo inicial con sala vacía", () => {
      const metrics = calculateBraceletMetrics(220, 0);
      expect(metrics.totalCapacity).toBe(220);
      expect(metrics.deliveredCount).toBe(0);
      expect(metrics.availableRemaining).toBe(220);
      expect(metrics.percentageOccupied).toBe(0);
      expect(metrics.status).toBe("AVAILABLE");
    });

    it("activa estado WARNING cuando supera el 80% o quedan 25 espacios o menos", () => {
      const metrics1 = calculateBraceletMetrics(220, 176); // 80%
      expect(metrics1.percentageOccupied).toBe(80);
      expect(metrics1.status).toBe("WARNING");

      const metrics2 = calculateBraceletMetrics(220, 196); // quedan 24
      expect(metrics2.status).toBe("WARNING");
      expect(metrics2.statusLabel).toContain("Últimos 24 espacios");
    });

    it("activa estado FULL cuando se alcanza el 100% de la capacidad", () => {
      const metrics = calculateBraceletMetrics(220, 220);
      expect(metrics.availableRemaining).toBe(0);
      expect(metrics.percentageOccupied).toBe(100);
      expect(metrics.status).toBe("FULL");
      expect(metrics.statusLabel).toContain("Aforo Completo");
    });
  });

  describe("applyBraceletDelta", () => {
    it("suma incrementos individuales (+1) y de grupos (+2, +3, +4)", () => {
      const res1 = applyBraceletDelta(10, 1, 220);
      expect(res1.nextCount).toBe(11);
      expect(res1.appliedDelta).toBe(1);
      expect(res1.isFull).toBe(false);

      const resGroup = applyBraceletDelta(11, 4, 220);
      expect(resGroup.nextCount).toBe(15);
      expect(resGroup.appliedDelta).toBe(4);
      expect(resGroup.isFull).toBe(false);
    });

    it("resta un brazalete (-1) para deshacer sin bajar de 0", () => {
      const res = applyBraceletDelta(5, -1, 220);
      expect(res.nextCount).toBe(4);
      expect(res.appliedDelta).toBe(-1);

      const resZero = applyBraceletDelta(0, -1, 220);
      expect(resZero.nextCount).toBe(0);
      expect(resZero.appliedDelta).toBe(0);
    });

    it("bloquea incrementos cuando el aforo ya está lleno (220)", () => {
      const res = applyBraceletDelta(220, 1, 220);
      expect(res.nextCount).toBe(220);
      expect(res.appliedDelta).toBe(0);
      expect(res.isFull).toBe(true);
    });

    it("recorta un grupo si sobrepasa el cupo restante", () => {
      // Quedan 2 espacios disponibles
      const res = applyBraceletDelta(218, 4, 220);
      expect(res.nextCount).toBe(220);
      expect(res.appliedDelta).toBe(2);
      expect(res.isFull).toBe(true);
    });
  });

  describe("createBraceletLogItem", () => {
    it("genera un registro de historial con timestamp y delta", () => {
      const log = createBraceletLogItem("evt-test", 2, 52, "Pareja en puerta");
      expect(log.eventId).toBe("evt-test");
      expect(log.delta).toBe(2);
      expect(log.totalAfter).toBe(52);
      expect(log.notes).toBe("Pareja en puerta");
      expect(typeof log.timestamp).toBe("string");
      expect(log.id).toContain("bc-log-");
    });
  });
});
