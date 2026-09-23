import { Seat, SeatStats, ZoneId } from "./types";

export const PLANTA_BAJA_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
export const BALCON_ROWS = ["K", "L", "M", "N", "O"] as const;

export const SEATS_PER_ROW_PLANTA_BAJA = 12; // 10 filas * 12 = 120 butacas
export const SEATS_PER_ROW_BALCON = 14;      // 5 filas * 14 = 70 butacas

export function generateInitialSeats(
  vipRowsPB: string[] = ["A"],
  vipRowsBalcon: string[] = ["K"]
): Seat[] {
  const seats: Seat[] = [];

  // 1. Planta Baja (120 butacas)
  for (const row of PLANTA_BAJA_ROWS) {
    const isVip = vipRowsPB.includes(row);
    for (let num = 1; num <= SEATS_PER_ROW_PLANTA_BAJA; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `PB-${row}-${formattedNum}`,
        zone: "PLANTA_BAJA" as ZoneId,
        row,
        number: num,
        label: `Platea ${row}-${formattedNum}`,
        isVip,
        status: "AVAILABLE",
      });
    }
  }

  // 2. Balcón / Anfiteatro (70 butacas)
  for (const row of BALCON_ROWS) {
    const isVip = vipRowsBalcon.includes(row);
    for (let num = 1; num <= SEATS_PER_ROW_BALCON; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `BAL-${row}-${formattedNum}`,
        zone: "BALCON" as ZoneId,
        row,
        number: num,
        label: `Balcón ${row}-${formattedNum}`,
        isVip,
        status: "AVAILABLE",
      });
    }
  }

  return seats;
}

export function groupSeatsByRow(seats: Seat[]): Record<string, Seat[]> {
  const groups: Record<string, Seat[]> = {};
  for (const seat of seats) {
    if (!groups[seat.row]) {
      groups[seat.row] = [];
    }
    groups[seat.row].push(seat);
  }
  return groups;
}

export function calculateSeatStats(seats: Seat[]): SeatStats {
  const stats: SeatStats = {
    total: seats.length,
    available: 0,
    reserved: 0,
    occupied: 0,
    vip: 0,
  };

  for (const seat of seats) {
    if (seat.isVip) stats.vip++;
    if (seat.status === "AVAILABLE") stats.available++;
    if (seat.status === "RESERVED") stats.reserved++;
    if (seat.status === "OCCUPIED") stats.occupied++;
  }

  return stats;
}
