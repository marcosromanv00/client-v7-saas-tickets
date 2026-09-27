import { describe, it, expect, beforeEach } from "vitest";
import { theaterStore } from "./ticket-store";
import { computeDynamicCapacity } from "./capacity-calculator";
import { TheaterEvent, Seat } from "./types";
import { DEFAULT_BRACELET_COLORS } from "./bracelet-utils";

describe("Admin Occupancy & Capacity Configuration", () => {
  beforeEach(() => {
    theaterStore.resetStore();
  });

  it("permite a un admin modificar la cantidad de butacas disponibles y el color de brazalete", () => {
    const state = theaterStore.getSnapshot();
    const event = state.events[0];
    expect(event).toBeDefined();

    const orangeColor = DEFAULT_BRACELET_COLORS.find((c) => c.id === "naranja-neon") || {
      id: "naranja-neon",
      name: "Naranja Neón",
      hex: "#f97316",
    };

    const updatedEvent: TheaterEvent = {
      ...event,
      totalCapacity: 185,
      braceletColorId: orangeColor.id,
      braceletColorName: orangeColor.name,
      braceletColorHex: orangeColor.hex,
    };

    theaterStore.updateEvent(updatedEvent);

    const newState = theaterStore.getSnapshot();
    const targetEvent = newState.events.find((e) => e.id === event.id);

    expect(targetEvent?.totalCapacity).toBe(185);
    expect(targetEvent?.braceletColorId).toBe("naranja-neon");
    expect(targetEvent?.braceletColorHex).toBe("#f97316");
  });

  it("calcula dinámicamente la ocupación para la simulación de sala considerando la nueva capacidad", () => {
    const state = theaterStore.getSnapshot();
    const event: TheaterEvent = {
      ...state.events[0],
      totalCapacity: 100,
    };

    const mockSeats: Seat[] = [
      { id: "PB-A-01", zone: "PLATEA_BAJA", row: "A", number: 1, label: "Platea A-01", isVip: true, status: "OCCUPIED" },
      { id: "PB-A-02", zone: "PLATEA_BAJA", row: "A", number: 2, label: "Platea A-02", isVip: true, status: "RESERVED" },
      { id: "PB-A-03", zone: "PLATEA_BAJA", row: "A", number: 3, label: "Platea A-03", isVip: false, status: "AVAILABLE" },
    ];

    const report = computeDynamicCapacity(event, state.tickets, state.specialGuests, mockSeats);

    expect(report.totalCapacity).toBe(100);
    expect(report.vipReservedCount).toBe(2);
    expect(report.availableRemaining).toBeLessThanOrEqual(100);
    expect(report.percentageOccupied).toBeGreaterThanOrEqual(0);
    expect(report.percentageOccupied).toBeLessThanOrEqual(100);
  });
});
