import { Seat, SeatStats, ZoneId } from "./types";

export const PLATEA_BAJA_ROWS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const NIVEL_MEDIO_ROWS = ["H", "I", "J", "K", "L", "M"] as const;
export const BALCON_ALTO_ROWS = ["N", "Ñ", "O", "P", "Q", "R"] as const;

// Aliases para compatibilidad
export const PLANTA_BAJA_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
export const BALCON_ROWS = ["N", "Ñ", "O", "P", "Q", "R"] as const;

// Aforo Oficial del Plano Arquitectónico: 225 butacas (Platea Baja 82 + Nivel Medio 69 + Balcón 74)
export const ROW_CONFIG_PLANTA_BAJA: Record<string, number> = {
  A: 12, B: 12, C: 12, D: 10, E: 10, F: 13, G: 13, // Platea Baja (82 butacas)
  H: 7, I: 12, J: 12, K: 12, L: 12, M: 14,          // Nivel Medio (69 butacas)
};

export const ROW_CONFIG_BALCON: Record<string, number> = {
  N: 12, Ñ: 12, O: 12, P: 12, Q: 12, R: 14,          // Balcón Superior (74 butacas)
};

export function getZoneLevelName(zone: ZoneId): string {
  switch (zone) {
    case "PLATEA_BAJA":
      return "Nivel 1: Platea Baja";
    case "NIVEL_MEDIO":
      return "Nivel 2: Nivel Medio";
    case "BALCON_ALTO":
    case "BALCON":
      return "Nivel 3: Balcón Superior";
    default:
      return "Platea";
  }
}

export function generateInitialSeats(
  vipRowsPB: string[] = ["A"],
  vipRowsBalcon: string[] = ["N"]
): Seat[] {
  const seats: Seat[] = [];

  // 1. Nivel 1: Platea Baja (82 butacas) - Filas A-G
  for (const row of PLATEA_BAJA_ROWS) {
    const isVip = vipRowsPB.includes(row);
    const count = ROW_CONFIG_PLANTA_BAJA[row] || 12;
    for (let num = 1; num <= count; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      const isWheelchair = (row === "D" || row === "E") && (num === 3 || num === 4);
      seats.push({
        id: `PB-${row}-${formattedNum}`,
        zone: "PLATEA_BAJA" as ZoneId,
        row,
        number: num,
        label: `Platea ${row}-${formattedNum}`,
        isVip,
        isWheelchairAccessible: isWheelchair,
        status: "AVAILABLE",
      });
    }
  }

  // 2. Nivel 2: Nivel Medio (69 butacas) - Filas H-M
  for (const row of NIVEL_MEDIO_ROWS) {
    const isVip = vipRowsPB.includes(row);
    const count = ROW_CONFIG_PLANTA_BAJA[row] || 12;
    for (let num = 1; num <= count; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `NM-${row}-${formattedNum}`,
        zone: "NIVEL_MEDIO" as ZoneId,
        row,
        number: num,
        label: `Medio ${row}-${formattedNum}`,
        isVip,
        isWheelchairAccessible: false,
        status: "AVAILABLE",
      });
    }
  }

  // 3. Nivel 3: Balcón Superior (74 butacas) - Filas N-R
  for (const row of BALCON_ALTO_ROWS) {
    const isVip = vipRowsBalcon.includes(row);
    const count = ROW_CONFIG_BALCON[row] || 12;
    for (let num = 1; num <= count; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `BAL-${row}-${formattedNum}`,
        zone: "BALCON_ALTO" as ZoneId,
        row,
        number: num,
        label: `Balcón ${row}-${formattedNum}`,
        isVip,
        isWheelchairAccessible: false,
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
