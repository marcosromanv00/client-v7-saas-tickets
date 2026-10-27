import { describe, it, expect } from "vitest";
import { calculateBraceletMetrics } from "./bracelet-counter-utils";

describe("Medidor Radial y Telemetría de Boletería (Arco Abierto 220°)", () => {
  it("calcula correctamente el arco abierto de 220° para el 0% con track físico definido", () => {
    const metrics = calculateBraceletMetrics(225, 0);
    const radius = 42;
    const fullCircumference = 2 * Math.PI * radius;
    const totalArcLength = fullCircumference * (220 / 360);
    const gapLength = fullCircumference - totalArcLength;

    expect(metrics.percentageOccupied).toBe(0);
    expect(totalArcLength).toBeCloseTo(161.27, 1);
    expect(gapLength).toBeCloseTo(102.62, 1);
    expect(metrics.status).toBe("AVAILABLE");
  });

  it("calcula correctamente la longitud de arco activo para el 50% de ocupación en arco de 220°", () => {
    const metrics = calculateBraceletMetrics(200, 100);
    const radius = 42;
    const fullCircumference = 2 * Math.PI * radius;
    const totalArcLength = fullCircumference * (220 / 360);
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const activeArcLength = (clamped / 100) * totalArcLength;

    expect(metrics.percentageOccupied).toBe(50);
    expect(activeArcLength).toBeCloseTo(totalArcLength / 2, 1);
  });

  it("calcula el 100% (aforo completo) con longitud de arco activo igual a la longitud total", () => {
    const metrics = calculateBraceletMetrics(225, 225);
    const radius = 42;
    const fullCircumference = 2 * Math.PI * radius;
    const totalArcLength = fullCircumference * (220 / 360);
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const activeArcLength = (clamped / 100) * totalArcLength;

    expect(metrics.percentageOccupied).toBe(100);
    expect(activeArcLength).toBeCloseTo(totalArcLength, 1);
    expect(metrics.status).toBe("FULL");
  });

  it("calcula ocupaciones intermedias (ej. 9%) llenando proporcionalmente el arco en sentido horario", () => {
    const metrics = calculateBraceletMetrics(100, 9);
    const radius = 42;
    const fullCircumference = 2 * Math.PI * radius;
    const totalArcLength = fullCircumference * (220 / 360);
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const activeArcLength = (clamped / 100) * totalArcLength;

    expect(metrics.percentageOccupied).toBe(9);
    expect(activeArcLength).toBeCloseTo(14.51, 1);
  });

  it("garantiza que los cupos disponibles y entregados sumen exactamente la capacidad total", () => {
    const total = 225;
    const delivered = 85;
    const metrics = calculateBraceletMetrics(total, delivered);

    expect(metrics.deliveredCount).toBe(85);
    expect(metrics.availableRemaining).toBe(140);
    expect(metrics.deliveredCount + metrics.availableRemaining).toBe(total);
  });
});
