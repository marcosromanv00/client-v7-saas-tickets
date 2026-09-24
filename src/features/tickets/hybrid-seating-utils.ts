import { Seat } from "./types";

/**
 * Orden jerárquico oficial de filas desde el proscenio hacia atrás:
 * 1. Platea Baja (Nivel 1): A -> B -> C -> D
 * 2. Nivel Medio (Nivel 2): E -> F -> G -> H -> I -> J
 * 3. Balcón Superior (Nivel 3): K -> L -> M -> N -> O
 */
const ROW_PRIORITY: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15,
};

/**
 * Encuentra la siguiente mejor butaca disponible para acomodo híbrido por orden de llegada (walk-in),
 * rellenando los espacios disponibles rigurosamente desde el frente hacia atrás.
 */
export function findNextBestAvailableSeat(seats: Seat[]): Seat | null {
  const availableSeats = seats.filter((s) => s.status === "AVAILABLE");
  if (availableSeats.length === 0) return null;

  return availableSeats.sort((a, b) => {
    const prioA = ROW_PRIORITY[a.row] ?? 99;
    const prioB = ROW_PRIORITY[b.row] ?? 99;
    if (prioA !== prioB) return prioA - prioB;
    return a.number - b.number;
  })[0] || null;
}

/**
 * Encuentra hasta N butacas contiguas o prioritarias desde el frente hacia atrás.
 */
export function findNextAvailableSeats(seats: Seat[], count: number = 1): Seat[] {
  const available = seats.filter((s) => s.status === "AVAILABLE");
  if (available.length === 0) return [];

  const sorted = [...available].sort((a, b) => {
    const prioA = ROW_PRIORITY[a.row] ?? 99;
    const prioB = ROW_PRIORITY[b.row] ?? 99;
    if (prioA !== prioB) return prioA - prioB;
    return a.number - b.number;
  });

  return sorted.slice(0, count);
}
