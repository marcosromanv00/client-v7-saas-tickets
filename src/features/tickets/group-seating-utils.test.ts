import { describe, it, expect } from "vitest";
import { suggestGroupSeating } from "./group-seating-utils";
import { Seat } from "./types";

function createMockSeat(id: string, row: string, number: number, status: Seat["status"] = "AVAILABLE"): Seat {
  return {
    id,
    zone: ["A", "B", "C", "D"].includes(row) ? "PLATEA_BAJA" : "NIVEL_MEDIO",
    row,
    number,
    label: `Fila ${row}-${number}`,
    isVip: row === "A",
    status,
  };
}

describe("suggestGroupSeating (Algoritmo de Sugerencia Inteligente de Grupos)", () => {
  it("asigna un bloque contiguo en la misma fila priorizando el frente", () => {
    const seats: Seat[] = [
      // Fila B: 4 contiguos libres
      createMockSeat("B-1", "B", 1, "AVAILABLE"),
      createMockSeat("B-2", "B", 2, "AVAILABLE"),
      createMockSeat("B-3", "B", 3, "AVAILABLE"),
      createMockSeat("B-4", "B", 4, "AVAILABLE"),
      // Fila C: 4 contiguos libres
      createMockSeat("C-1", "C", 1, "AVAILABLE"),
      createMockSeat("C-2", "C", 2, "AVAILABLE"),
      createMockSeat("C-3", "C", 3, "AVAILABLE"),
      createMockSeat("C-4", "C", 4, "AVAILABLE"),
    ];

    const result = suggestGroupSeating(seats, 4);

    expect(result.hasSufficientSeats).toBe(true);
    expect(result.isContiguous).toBe(true);
    expect(result.subgroups).toHaveLength(1);
    expect(result.subgroups[0].row).toBe("B");
    expect(result.selectedSeatIds).toEqual(["B-1", "B-2", "B-3", "B-4"]);
    expect(result.explanation).toContain("juntas en Fila B");
  });

  it("divide en subgrupos balanceados en filas cercanas cuando no caben todos en una sola fila", () => {
    const seats: Seat[] = [
      // Fila B: solo 2 libres
      createMockSeat("B-1", "B", 1, "AVAILABLE"),
      createMockSeat("B-2", "B", 2, "AVAILABLE"),
      createMockSeat("B-3", "B", 3, "OCCUPIED"),
      // Fila C: 2 libres
      createMockSeat("C-1", "C", 1, "AVAILABLE"),
      createMockSeat("C-2", "C", 2, "AVAILABLE"),
      createMockSeat("C-3", "C", 3, "OCCUPIED"),
    ];

    const result = suggestGroupSeating(seats, 4);

    expect(result.hasSufficientSeats).toBe(true);
    expect(result.isContiguous).toBe(false);
    expect(result.allocatedCount).toBe(4);
    expect(result.subgroups.length).toBeGreaterThanOrEqual(2);
    // Debe usar fila B y fila C
    const rowsUsed = result.subgroups.map((s) => s.row);
    expect(rowsUsed).toContain("B");
    expect(rowsUsed).toContain("C");
  });

  it("identifica cuando el aforo disponible es menor al tamaño solicitado del grupo", () => {
    const seats: Seat[] = [
      createMockSeat("B-1", "B", 1, "AVAILABLE"),
      createMockSeat("B-2", "B", 2, "AVAILABLE"),
      createMockSeat("B-3", "B", 3, "OCCUPIED"),
    ];

    const result = suggestGroupSeating(seats, 5);

    expect(result.hasSufficientSeats).toBe(false);
    expect(result.allocatedCount).toBe(2);
    expect(result.explanation).toContain("Aforo insuficiente");
  });
});
