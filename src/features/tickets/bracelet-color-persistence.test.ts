import { describe, it, expect, beforeEach } from "vitest";
import { loadInitialState, STORAGE_KEY } from "./initial-state";
import { DEFAULT_BRACELET_COLORS } from "./bracelet-utils";
import { TheaterEvent } from "./types";

describe("Bracelet Color & State Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("mantiene el catálogo ampliado de colores oficiales Tyvek", () => {
    expect(DEFAULT_BRACELET_COLORS.length).toBeGreaterThanOrEqual(8);
    const neon = DEFAULT_BRACELET_COLORS.find((c) => c.id === "verde-neon");
    expect(neon).toBeDefined();
    expect(neon?.hex).toBe("#10b981");

    const orange = DEFAULT_BRACELET_COLORS.find((c) => c.id === "naranja-neon");
    expect(orange).toBeDefined();
    expect(orange?.hex).toBe("#f97316");
  });

  it("preserva cambios de color de brazalete al recargar o cargar estado", () => {
    const initialState = loadInitialState();
    const eventId = "evt-pato-barraza-26";

    // Simular actualización de color a Naranja Neón
    const updatedEvents = initialState.events.map((evt: TheaterEvent) =>
      evt.id === eventId
        ? {
            ...evt,
            braceletColorId: "naranja-neon",
            braceletColorName: "Naranja Neón",
            braceletColorHex: "#f97316",
          }
        : evt
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        events: updatedEvents,
      })
    );

    // Recargar estado desde storage
    const reloadedState = loadInitialState();
    const targetEvent = reloadedState.events.find((e: TheaterEvent) => e.id === eventId);

    expect(targetEvent?.braceletColorId).toBe("naranja-neon");
    expect(targetEvent?.braceletColorName).toBe("Naranja Neón");
    expect(targetEvent?.braceletColorHex).toBe("#f97316");
  });
});
