import { describe, it, expect } from "vitest";
import { findActiveEventForDate, getDefaultActiveEventId } from "./event-date-utils";
import { INITIAL_EVENTS } from "./mock-data";

describe("event-date-utils", () => {
  it("selecciona automáticamente la función del sábado 26 de septiembre de 2026", () => {
    const active = findActiveEventForDate(INITIAL_EVENTS, "2026-09-26");
    expect(active).toBeDefined();
    expect(active?.id).toBe("evt-pato-barraza-26");
    expect(active?.title).toContain("Entre Héroes y Amigos");
    expect(active?.tagline).toContain("Pato Barraza");
  });

  it("selecciona automáticamente la función del domingo 27 de septiembre de 2026", () => {
    const active = findActiveEventForDate(INITIAL_EVENTS, "2026-09-27");
    expect(active).toBeDefined();
    expect(active?.id).toBe("evt-escats-27");
  });

  it("selecciona automáticamente la gala de reapertura del viernes 25 de septiembre de 2026", () => {
    const active = findActiveEventForDate(INITIAL_EVENTS, "2026-09-25");
    expect(active).toBeDefined();
    expect(active?.id).toBe("evt-reapertura-25");
  });

  it("si la fecha no tiene función, selecciona la siguiente función más cercana", () => {
    // Lunes 28 de septiembre (sin función) -> debe saltar al sábado 3 de octubre (Elvirilla)
    const active = findActiveEventForDate(INITIAL_EVENTS, "2026-09-28");
    expect(active).toBeDefined();
    expect(active?.id).toBe("evt-elvirilla-03");
  });

  it("getDefaultActiveEventId devuelve el ID del evento de hoy", () => {
    const eventId = getDefaultActiveEventId(INITIAL_EVENTS, "2026-09-26");
    expect(eventId).toBe("evt-pato-barraza-26");
  });
});
