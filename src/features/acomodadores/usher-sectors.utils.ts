import { Seat } from "../tickets/types";
import { TheaterState } from "../tickets/ticket-store-types";
import { generateInitialSeats } from "../tickets/theater-layout";
import {
  UsherSectorConfig,
  UsherSectorId,
  isSeatInSector,
} from "./usher-sectors.config";

export interface UsherSectorMetrics {
  total: number;
  available: number;
  occupied: number;
  selected: number;
  occupancyPercent: number;
}

export function filterSeatsForSector(
  seats: Seat[],
  sectorId: UsherSectorId
): Seat[] {
  // Ordenar asientos de derecha a izquierda según numeración real
  return seats
    .filter((s) => isSeatInSector(s, sectorId))
    .sort((a, b) => {
      if (a.row !== b.row) return a.row.localeCompare(b.row);
      return b.number - a.number; // Invertido: 1 a la derecha
    });
}

export function calculateSectorMetrics(
  seats: Seat[],
  selectedSeatIds: string[],
  sectorConfig: UsherSectorConfig
): UsherSectorMetrics {
  const sectorSeats = seats.filter((s) => isSeatInSector(s, sectorConfig.id));
  const total = sectorSeats.length || sectorConfig.totalSeats;
  const occupied = sectorSeats.filter((s) => s.status !== "AVAILABLE").length;
  const available = Math.max(0, total - occupied);
  const selected = sectorSeats.filter((s) => selectedSeatIds.includes(s.id)).length;
  const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return {
    total,
    available,
    occupied,
    selected,
    occupancyPercent,
  };
}

export function groupSectorSeatsByRow(seats: Seat[]): Record<string, Seat[]> {
  const groups: Record<string, Seat[]> = {};
  for (const seat of seats) {
    if (!groups[seat.row]) {
      groups[seat.row] = [];
    }
    groups[seat.row].push(seat);
  }
  // Asegurar orden descendente de números (derecha a izquierda) en cada fila
  for (const row of Object.keys(groups)) {
    groups[row].sort((a, b) => b.number - a.number);
  }
  return groups;
}

export function executeBatchSetSeatOccupancy(
  state: TheaterState,
  eventId: string,
  seatIds: string[],
  nextStatus: "AVAILABLE" | "OCCUPIED"
): TheaterState {
  if (seatIds.length === 0) return state;
  const currentSeats = state.seatsByEvent[eventId] || generateInitialSeats();
  const idSet = new Set(seatIds);
  const updatedSeats = currentSeats.map((s) =>
    idSet.has(s.id) ? { ...s, status: nextStatus } : s
  );

  return {
    ...state,
    seatsByEvent: {
      ...state.seatsByEvent,
      [eventId]: updatedSeats,
    },
  };
}
