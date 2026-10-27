import { describe, it, expect } from "vitest";
import { calculateBraceletMetrics } from "./bracelet-counter-utils";

describe("Medidor Radial y Telemetría de Boletería", () => {
  it("calcula correctamente los parámetros geométricos del arco para el 0%", () => {
    const metrics = calculateBraceletMetrics(225, 0);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const offset = circumference - (clamped / 100) * circumference;

    expect(metrics.percentageOccupied).toBe(0);
    expect(offset).toBeCloseTo(circumference, 1);
    expect(metrics.status).toBe("AVAILABLE");
  });

  it("calcula correctamente el desplazamiento para el 50% de ocupación", () => {
    const metrics = calculateBraceletMetrics(200, 100);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const offset = circumference - (clamped / 100) * circumference;

    expect(metrics.percentageOccupied).toBe(50);
    expect(offset).toBeCloseTo(circumference / 2, 1);
  });

  it("calcula el 100% (aforo completo) con offset cero", () => {
    const metrics = calculateBraceletMetrics(225, 225);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(100, Math.max(0, metrics.percentageOccupied));
    const offset = circumference - (clamped / 100) * circumference;

    expect(metrics.percentageOccupied).toBe(100);
    expect(offset).toBe(0);
    expect(metrics.status).toBe("FULL");
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
