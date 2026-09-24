import { describe, it, expect } from "vitest";
import { evaluateEventCutoff } from "./cutoff-utils";

describe("evaluateEventCutoff (Regla de Corte de 20 Minutos)", () => {
  const eventDate = "2026-09-25";
  const eventTime = "19:00";

  it("permite la boletería web cuando faltan más de 20 minutos para el inicio", () => {
    // 18:30 -> faltan 30 minutos
    const currentTime = new Date(2026, 8, 25, 18, 30, 0);
    const result = evaluateEventCutoff(eventDate, eventTime, 20, currentTime);

    expect(result.isWebLocked).toBe(false);
    expect(result.isReleaseActive).toBe(false);
    expect(result.minutesRemaining).toBe(30);
    expect(result.statusText).toContain("Abierta");
  });

  it("bloquea la boletería web a exactamente 20 minutos del evento", () => {
    // 18:40 -> faltan 20 minutos
    const currentTime = new Date(2026, 8, 25, 18, 40, 0);
    const result = evaluateEventCutoff(eventDate, eventTime, 20, currentTime);

    expect(result.isWebLocked).toBe(true);
    expect(result.isReleaseActive).toBe(false);
    expect(result.minutesRemaining).toBe(20);
    expect(result.statusText).toContain("Cerrada");
  });

  it("mantiene el bloqueo web y activa la liberación de 15 minutos", () => {
    // 18:46 -> faltan 14 minutos
    const currentTime = new Date(2026, 8, 25, 18, 46, 0);
    const result = evaluateEventCutoff(eventDate, eventTime, 20, currentTime);

    expect(result.isWebLocked).toBe(true);
    expect(result.isReleaseActive).toBe(true);
    expect(result.minutesRemaining).toBe(14);
    expect(result.statusText).toContain("Liberadas");
  });

  it("indica función iniciada cuando la hora actual iguala o supera la hora del evento", () => {
    // 19:05 -> evento ya inició
    const currentTime = new Date(2026, 8, 25, 19, 5, 0);
    const result = evaluateEventCutoff(eventDate, eventTime, 20, currentTime);

    expect(result.isWebLocked).toBe(true);
    expect(result.minutesRemaining).toBeLessThanOrEqual(0);
    expect(result.statusText).toContain("Iniciada");
  });
});
