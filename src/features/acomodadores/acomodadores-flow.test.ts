import { describe, it, expect } from "vitest";
import { generateInitialSeats } from "../tickets/theater-layout";
import { loadInitialState } from "../tickets/initial-state";
import {
  calculateAcomodadorRoomMetrics,
  executeToggleSeatOccupancy,
  executeFillRowOccupancy,
} from "./acomodadores-seat-handler";

describe("Módulo de Acomodadores en Sala y Flujo de Brazaletes", () => {
  it("calcula con precisión las métricas comparativas entre boletería y sala", () => {
    const seats = generateInitialSeats();
    // Marcar 10 butacas como ocupadas manualmente
    seats[0].status = "OCCUPIED";
    seats[1].status = "OCCUPIED";
    seats[2].status = "OCCUPIED";

    const totalCapacity = 225;
    const deliveredBracelets = 15; // 15 brazaletes entregados en boletería

    const metrics = calculateAcomodadorRoomMetrics(totalCapacity, seats, deliveredBracelets);

    expect(metrics.totalCapacity).toBe(225);
    expect(metrics.braceletsDelivered).toBe(15);
    expect(metrics.seatedInRoom).toBe(3);
    // 15 entregados - 3 sentados = 12 en camino o no llegaron
    expect(metrics.inTransitOrNoShow).toBe(12);
    // 225 totales - 3 sentados = 222 campos libres en sala
    expect(metrics.availableSeats).toBe(222);
  });

  it("permite a un acomodador alternar el estado de una butaca (Libre <-> Ocupada) con un solo toque", () => {
    const state = loadInitialState();
    const eventId = state.events[0].id;
    const initialSeats = state.seatsByEvent[eventId] || generateInitialSeats();
    state.seatsByEvent[eventId] = initialSeats;

    const targetSeat = initialSeats[0];
    expect(targetSeat.status).toBe("AVAILABLE");

    // 1er Toque: pasa a OCCUPIED
    const stateAfterTouch1 = executeToggleSeatOccupancy(state, eventId, targetSeat.id);
    const seatAfter1 = stateAfterTouch1.seatsByEvent[eventId].find((s) => s.id === targetSeat.id);
    expect(seatAfter1?.status).toBe("OCCUPIED");

    // 2do Toque: pasa de nuevo a AVAILABLE
    const stateAfterTouch2 = executeToggleSeatOccupancy(stateAfterTouch1, eventId, targetSeat.id);
    const seatAfter2 = stateAfterTouch2.seatsByEvent[eventId].find((s) => s.id === targetSeat.id);
    expect(seatAfter2?.status).toBe("AVAILABLE");
  });

  it("permite a un acomodador llenar o liberar una fila completa de un solo golpe para grupos", () => {
    const state = loadInitialState();
    const eventId = state.events[0].id;
    const initialSeats = generateInitialSeats();
    state.seatsByEvent[eventId] = initialSeats;

    // Fila B (tiene 12 butacas)
    const rowBBefore = initialSeats.filter((s) => s.row === "B");
    expect(rowBBefore.every((s) => s.status === "AVAILABLE")).toBe(true);

    // Acción rápida: +Llenar Fila B
    const stateRowFilled = executeFillRowOccupancy(state, eventId, "B", true);
    const rowBAfterFill = stateRowFilled.seatsByEvent[eventId].filter((s) => s.row === "B");
    expect(rowBAfterFill.every((s) => s.status === "OCCUPIED")).toBe(true);

    // Acción rápida: Liberar Fila B
    const stateRowCleared = executeFillRowOccupancy(stateRowFilled, eventId, "B", false);
    const rowBAfterClear = stateRowCleared.seatsByEvent[eventId].filter((s) => s.row === "B");
    expect(rowBAfterClear.every((s) => s.status === "AVAILABLE")).toBe(true);
  });
});
