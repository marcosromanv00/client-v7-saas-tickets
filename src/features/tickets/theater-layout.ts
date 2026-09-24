import { Seat, SeatStats, ZoneId } from "./types";

export const PLATEA_BAJA_ROWS = ["A", "B", "C", "D"] as const;
export const NIVEL_MEDIO_ROWS = ["E", "F", "G", "H", "I", "J"] as const;
export const BALCON_ALTO_ROWS = ["K", "L", "M", "N", "O"] as const;

// Aliases para compatibilidad
export const PLANTA_BAJA_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
export const BALCON_ROWS = ["K", "L", "M", "N", "O"] as const;

// Aforo Oficial: 220 butacas (Platea Baja 62 + Nivel Medio 96 + Balcón 62)
export const ROW_CONFIG_PLANTA_BAJA: Record<string, number> = {
  A: 14, // 7 izq, 7 der (Fila Protocolo VIP frontal)
  B: 16, C: 16, D: 16, E: 16, F: 16, G: 16, H: 16, I: 16, J: 16, // 8 izq, 8 der
};

export const ROW_CONFIG_BALCON: Record<string, number> = {
  K: 12, L: 12, M: 12, N: 12, // 4 filas centradas de 12
  O: 14,                      // 1 fila posterior de 14
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
  vipRowsBalcon: string[] = ["K"]
): Seat[] {
  const seats: Seat[] = [];

  // 1. Nivel 1: Platea Baja (62 butacas) - Delante del descanso / pasarela
  for (const row of PLATEA_BAJA_ROWS) {
    const isVip = vipRowsPB.includes(row);
    const count = ROW_CONFIG_PLANTA_BAJA[row] || 16;
    for (let num = 1; num <= count; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `PB-${row}-${formattedNum}`,
        zone: "PLATEA_BAJA" as ZoneId,
        row,
        number: num,
        label: `Platea ${row}-${formattedNum}`,
        isVip,
        status: "AVAILABLE",
      });
    }
  }

  // 2. Nivel 2: Nivel Medio (96 butacas) - Detrás de pasarela de acceso y gradas
  for (const row of NIVEL_MEDIO_ROWS) {
    const isVip = vipRowsPB.includes(row);
    const count = ROW_CONFIG_PLANTA_BAJA[row] || 16;
    for (let num = 1; num <= count; num++) {
      const formattedNum = num < 10 ? `0${num}` : `${num}`;
      seats.push({
        id: `NM-${row}-${formattedNum}`,
        zone: "NIVEL_MEDIO" as ZoneId,
        row,
        number: num,
        label: `Medio ${row}-${formattedNum}`,
        isVip,
        status: "AVAILABLE",
      });
    }
  }

  // 3. Nivel 3: Balcón Superior (62 butacas)
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
