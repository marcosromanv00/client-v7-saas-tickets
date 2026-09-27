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
            isWheelchairAccessible: (row.rowLetter === "D" || row.rowLetter === "E") && (seatNum === 3 || seatNum === 4),
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

// Genera la distribución oficial de los 3 niveles del Teatro Municipal (225 butacas)
export function getOfficialPresetMatrix(): {
  plateaBaja: MatrixRow[];
  nivelMedio: MatrixRow[];
  balcon: MatrixRow[];
} {
  // Nivel 1: Platea Baja (82 butacas) - Filas A-G
  const plateaBaja: MatrixRow[] = PLATEA_BAJA_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    const isVip = rowLetter === "A";

    if (rowLetter === "A" || rowLetter === "B" || rowLetter === "C") {
      for (let c = 2; c <= 6; c++) cells[c] = isVip ? "VIP" : "SEAT"; // 5
      for (let c = 9; c <= 15; c++) cells[c] = isVip ? "VIP" : "SEAT"; // 7 -> 12
    } else if (rowLetter === "D" || rowLetter === "E") {
      for (let c = 3; c <= 5; c++) cells[c] = "SEAT"; // 3
      for (let c = 9; c <= 15; c++) cells[c] = "SEAT"; // 7 -> 10
    } else {
      // F, G
      for (let c = 1; c <= 6; c++) cells[c] = "SEAT"; // 6
      for (let c = 9; c <= 15; c++) cells[c] = "SEAT"; // 7 -> 13
    }
    return { rowLetter, zone: "PLATEA_BAJA" as ZoneId, cells };
  });

  // Nivel 2: Nivel Medio (69 butacas) - Filas H-M
  const nivelMedio: MatrixRow[] = NIVEL_MEDIO_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    if (rowLetter === "H") {
      for (let c = 9; c <= 15; c++) cells[c] = "SEAT"; // 7
    } else if (rowLetter === "M") {
      for (let c = 1; c <= 7; c++) cells[c] = "SEAT"; // 7
      for (let c = 10; c <= 14; c++) cells[c] = "SEAT"; // 5
      for (let c = 16; c <= 17; c++) cells[c] = "SEAT"; // 2 -> 14
    } else {
      // I, J, K, L
      for (let c = 1; c <= 7; c++) cells[c] = "SEAT"; // 7
      for (let c = 10; c <= 14; c++) cells[c] = "SEAT"; // 5 -> 12
    }
    return { rowLetter, zone: "NIVEL_MEDIO" as ZoneId, cells };
  });

  // Nivel 3: Balcón Superior (74 butacas) - Filas N-R
  const balcon: MatrixRow[] = BALCON_ALTO_ROWS.map((rowLetter) => {
    const cells: CellType[] = Array(MATRIX_COLS).fill("EMPTY");
    if (rowLetter === "R") {
      for (let c = 2; c <= 15; c++) cells[c] = "SEAT"; // 14
    } else {
      for (let c = 3; c <= 14; c++) cells[c] = rowLetter === "N" ? "VIP" : "SEAT"; // 12
    }
    return { rowLetter, zone: "BALCON_ALTO" as ZoneId, cells };
  });

  return { plateaBaja, nivelMedio, balcon };
}
