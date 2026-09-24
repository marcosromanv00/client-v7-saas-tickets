import { Seat, ZoneId } from "../tickets/types";
import { PLATEA_BAJA_ROWS, NIVEL_MEDIO_ROWS, BALCON_ALTO_ROWS } from "../tickets/theater-layout";

export const MATRIX_COLS = 18;

export type CellType = "EMPTY" | "SEAT" | "VIP";

export interface MatrixRow {
  rowLetter: string;
  zone: ZoneId;
  cells: CellType[];
}

export function getRowsForZone(zone: ZoneId): readonly string[] {
  if (zone === "PLATEA_BAJA") return PLATEA_BAJA_ROWS;
  if (zone === "NIVEL_MEDIO") return NIVEL_MEDIO_ROWS;
  return BALCON_ALTO_ROWS;
}

// Genera la cuadrícula a partir de las butacas de un nivel específico
export function buildMatrixFromSeats(seats: Seat[], zone: ZoneId): MatrixRow[] {
  const rows = getRowsForZone(zone);
  const seatsByRow: Record<string, Seat[]> = {};
  seats.forEach((s) => {
    if (s.zone === zone || (zone === "PLATEA_BAJA" && s.zone === "PLANTA_BAJA" && PLATEA_BAJA_ROWS.includes(s.row as any)) || (zone === "NIVEL_MEDIO" && s.zone === "PLANTA_BAJA" && NIVEL_MEDIO_ROWS.includes(s.row as any)) || (zone === "BALCON_ALTO" && s.zone === "BALCON")) {
      if (!seatsByRow[s.row]) seatsByRow[s.row] = [];
      seatsByRow[s.row].push(s);
    }
  });

  return rows.map((rowLetter) => {
    const rowSeats = seatsByRow[rowLetter] || [];
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    const count = rowSeats.length;

    if (count > 0) {
      const startCol = Math.max(0, Math.floor((MATRIX_COLS - count) / 2));
      rowSeats.forEach((seat, idx) => {
        const col = startCol + idx;
        if (col < MATRIX_COLS) {
          cells[col] = seat.isVip ? "VIP" : "SEAT";
        }
      });
    }

    return { rowLetter, zone, cells };
  });
}

// Convierte las 3 matrices de nuevo a la lista completa de Seat[]
export function convertMatrixToSeats(
  plateaBajaMatrix: MatrixRow[],
  nivelMedioMatrix: MatrixRow[],
  balconMatrix: MatrixRow[]
): Seat[] {
  const result: Seat[] = [];

  const processRows = (matrix: MatrixRow[]) => {
    matrix.forEach((row) => {
      let seatNum = 1;
      row.cells.forEach((cell) => {
        if (cell === "SEAT" || cell === "VIP") {
          const formattedNum = seatNum < 10 ? `0${seatNum}` : `${seatNum}`;
          const isPB = row.zone === "PLATEA_BAJA";
          const isNM = row.zone === "NIVEL_MEDIO";
          const prefix = isPB ? "PB" : isNM ? "NM" : "BAL";
          const labelPrefix = isPB ? "Platea" : isNM ? "Medio" : "Balcón";

          result.push({
            id: `${prefix}-${row.rowLetter}-${formattedNum}`,
            zone: row.zone,
            row: row.rowLetter,
            number: seatNum,
            label: `${labelPrefix} ${row.rowLetter}-${formattedNum}`,
            isVip: cell === "VIP",
            status: "AVAILABLE",
          });
          seatNum++;
        }
      });
    });
  };

  processRows(plateaBajaMatrix);
  processRows(nivelMedioMatrix);
  processRows(balconMatrix);
  return result;
}

// Genera la distribución oficial de los 3 niveles del Teatro Municipal (220 butacas)
export function getOfficialPresetMatrix(): {
  plateaBaja: MatrixRow[];
  nivelMedio: MatrixRow[];
  balcon: MatrixRow[];
} {
  // Nivel 1: Platea Baja (62 butacas) - Delante de pasarela de acceso
  const plateaBaja: MatrixRow[] = PLATEA_BAJA_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    const isVip = rowLetter === "A";

    if (rowLetter === "A") {
      for (let c = 1; c <= 7; c++) cells[c] = isVip ? "VIP" : "SEAT";
      for (let c = 10; c <= 16; c++) cells[c] = isVip ? "VIP" : "SEAT";
    } else {
      for (let c = 0; c <= 7; c++) cells[c] = "SEAT";
      for (let c = 10; c <= 17; c++) cells[c] = "SEAT";
    }
    return { rowLetter, zone: "PLATEA_BAJA" as ZoneId, cells };
  });

  // Nivel 2: Nivel Medio (96 butacas) - Detrás de pasarela de acceso y gradas
  const nivelMedio: MatrixRow[] = NIVEL_MEDIO_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    for (let c = 0; c <= 7; c++) cells[c] = "SEAT";
    for (let c = 10; c <= 17; c++) cells[c] = "SEAT";
    return { rowLetter, zone: "NIVEL_MEDIO" as ZoneId, cells };
  });

  // Nivel 3: Balcón Superior (62 butacas) - 4x12 centradas + 1x14 detrás
  const balcon: MatrixRow[] = BALCON_ALTO_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    if (rowLetter === "O") {
      for (let c = 2; c <= 15; c++) cells[c] = "SEAT";
    } else {
      for (let c = 3; c <= 14; c++) cells[c] = rowLetter === "K" ? "VIP" : "SEAT";
    }
    return { rowLetter, zone: "BALCON_ALTO" as ZoneId, cells };
  });

  return { plateaBaja, nivelMedio, balcon };
}
