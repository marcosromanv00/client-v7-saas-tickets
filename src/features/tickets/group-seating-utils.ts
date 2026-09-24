import { Seat, ZoneId } from "./types";

const ROW_PRIORITY: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4,
  E: 5, F: 6, G: 7, H: 8, I: 9, J: 10,
  K: 11, L: 12, M: 13, N: 14, O: 15,
};

export interface GroupSuggestionSubgroup {
  row: string;
  zone: ZoneId;
  seats: Seat[];
  description: string;
}

export interface GroupSuggestionResult {
  requestedCount: number;
  allocatedCount: number;
  isContiguous: boolean;
  subgroups: GroupSuggestionSubgroup[];
  selectedSeatIds: string[];
  explanation: string;
  hasSufficientSeats: boolean;
}

/**
 * Agrupa butacas disponibles por fila y detecta secuencias contiguas continuas.
 */
function findContiguousRunsInRow(rowSeats: Seat[]): Seat[][] {
  const sorted = [...rowSeats].sort((a, b) => a.number - b.number);
  const runs: Seat[][] = [];
  let currentRun: Seat[] = [];

  for (const seat of sorted) {
    if (currentRun.length === 0) {
      currentRun.push(seat);
    } else {
      const prevSeat = currentRun[currentRun.length - 1];
      if (seat.number === prevSeat.number + 1) {
        currentRun.push(seat);
      } else {
        runs.push(currentRun);
        currentRun = [seat];
      }
    }
  }

  if (currentRun.length > 0) {
    runs.push(currentRun);
  }

  return runs;
}

/**
 * Sugiere la mejor distribución de butacas para un grupo bajo una misma cédula.
 */
export function suggestGroupSeating(
  seats: Seat[],
  headcount: number,
  zonePreference?: ZoneId
): GroupSuggestionResult {
  const availableSeats = seats.filter((s) => s.status === "AVAILABLE");

  if (availableSeats.length < headcount) {
    const fallbackSorted = [...availableSeats].sort((a, b) => {
      const pA = ROW_PRIORITY[a.row] ?? 99;
      const pB = ROW_PRIORITY[b.row] ?? 99;
      return pA !== pB ? pA - pB : a.number - b.number;
    });

    return {
      requestedCount: headcount,
      allocatedCount: fallbackSorted.length,
      isContiguous: false,
      subgroups: fallbackSorted.length > 0 ? [{
        row: fallbackSorted[0].row,
        zone: fallbackSorted[0].zone,
        seats: fallbackSorted,
        description: `Asignación parcial (${fallbackSorted.length}/${headcount})`,
      }] : [],
      selectedSeatIds: fallbackSorted.map((s) => s.id),
      explanation: `Aforo insuficiente: Solo restan ${availableSeats.length} butacas libres en toda la sala.`,
      hasSufficientSeats: false,
    };
  }

  // Agrupar por fila disponible
  const seatsByRow = new Map<string, Seat[]>();
  for (const s of availableSeats) {
    if (zonePreference && s.zone !== zonePreference) continue;
    const rowList = seatsByRow.get(s.row) || [];
    rowList.push(s);
    seatsByRow.set(s.row, rowList);
  }

  const sortedRows = Array.from(seatsByRow.keys()).sort((a, b) => {
    return (ROW_PRIORITY[a] ?? 99) - (ROW_PRIORITY[b] ?? 99);
  });

  // Fase 1: Buscar bloque único contiguo de N en la misma fila
  for (const row of sortedRows) {
    const rowSeats = seatsByRow.get(row) || [];
    const runs = findContiguousRunsInRow(rowSeats);
    const validRun = runs.find((r) => r.length >= headcount);

    if (validRun) {
      // Tomar exactamente los headcount asientos centrados o iniciales
      const chosenSeats = validRun.slice(0, headcount);
      const seatNumbers = chosenSeats.map((s) => s.number.toString().padStart(2, "0")).join(", ");

      return {
        requestedCount: headcount,
        allocatedCount: headcount,
        isContiguous: true,
        subgroups: [
          {
            row,
            zone: chosenSeats[0].zone,
            seats: chosenSeats,
            description: `${headcount} personas juntas en Fila ${row} (${seatNumbers})`,
          },
        ],
        selectedSeatIds: chosenSeats.map((s) => s.id),
        explanation: `${headcount} personas juntas en Fila ${row} (Platea/Nivel más cercano disponible).`,
        hasSufficientSeats: true,
      };
    }
  }

  // Fase 2: Partición en subgrupos contiguos balanceados en filas cercanas
  const allocated: Seat[] = [];
  const subgroups: GroupSuggestionSubgroup[] = [];
  let remainingNeeded = headcount;

  for (const row of sortedRows) {
    if (remainingNeeded <= 0) break;
    const rowSeats = seatsByRow.get(row) || [];
    const runs = findContiguousRunsInRow(rowSeats);

    // Ordenar corridas por longitud descendente
    runs.sort((a, b) => b.length - a.length);

    for (const run of runs) {
      if (remainingNeeded <= 0) break;
      const takeCount = Math.min(run.length, remainingNeeded);
      const chosen = run.slice(0, takeCount);
      allocated.push(...chosen);
      remainingNeeded -= takeCount;

      subgroups.push({
        row,
        zone: chosen[0].zone,
        seats: chosen,
        description: `${takeCount} persona(s) en Fila ${row} (${chosen.map((s) => s.number.toString().padStart(2, "0")).join(", ")})`,
      });
    }
  }

  const explanation = `Distribución repartida en ${subgroups.length} filas cercanas (${subgroups.map((sg) => sg.description).join(" • ")})`;

  return {
    requestedCount: headcount,
    allocatedCount: allocated.length,
    isContiguous: false,
    subgroups,
    selectedSeatIds: allocated.map((s) => s.id),
    explanation,
    hasSufficientSeats: true,
  };
}
