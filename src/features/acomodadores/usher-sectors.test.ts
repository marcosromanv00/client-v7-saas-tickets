import { describe, it, expect } from "vitest";
import { generateInitialSeats } from "../tickets/theater-layout";
import { loadInitialState } from "../tickets/initial-state";
import {
  USHER_SECTORS,
  USHER_SECTOR_LIST,
  isSeatInSector,
} from "./usher-sectors.config";
import {
  calculateSectorMetrics,
  filterSeatsForSector,
  groupSectorSeatsByRow,
  executeBatchSetSeatOccupancy,
} from "./usher-sectors.utils";

describe("Sectores Arquitectónicos y Geometría Oficial de Acomodadores", () => {
  const allSeats = generateInitialSeats();

  it("particiona las 225 butacas del Teatro Municipal sin colisiones ni omisiones", () => {
    expect(allSeats.length).toBe(225);
    expect(USHER_SECTOR_LIST.length).toBe(6);

    const counts: Record<string, number> = {};
    for (const sector of USHER_SECTOR_LIST) {
      const seatsInSector = allSeats.filter((s) => isSeatInSector(s, sector.id));
      counts[sector.id] = seatsInSector.length;
    }

    expect(counts.PB_DER).toBe(33);
    expect(counts.PB_IZQ).toBe(49);
    expect(counts.MED_DER).toBe(42);
    expect(counts.MED_IZQ).toBe(27);
    expect(counts.BAL_DER).toBe(42);
    expect(counts.BAL_IZQ).toBe(32);

    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(225);

    // Verificar que cada butaca pertenezca a exactamente 1 sector
    for (const seat of allSeats) {
      const matchedSectors = USHER_SECTOR_LIST.filter((sec) =>
        isSeatInSector(seat, sec.id)
      );
      expect(
        matchedSectors.length,
        `Butaca ${seat.id} (${seat.row}-${seat.number}) debe pertenecer a 1 solo sector`
      ).toBe(1);
    }
  });

  it("filtra y ordena las butacas respetando la numeración física invertida (1 a la derecha)", () => {
    const medDerSeats = filterSeatsForSector(allSeats, "MED_DER");
    expect(medDerSeats.length).toBe(42);

    const rowH = medDerSeats.filter((s) => s.row === "H");
    expect(rowH.length).toBe(7);
    // Orden descendente de número: [7, 6, 5, 4, 3, 2, 1]
    expect(rowH.map((s) => s.number)).toEqual([7, 6, 5, 4, 3, 2, 1]);
  });

  it("calcula métricas de aforo, disponibilidad y selección por sector en tiempo real", () => {
    const seats = generateInitialSeats();
    // Ocupar 3 butacas en Platea Derecha
    const pbDerSeats = filterSeatsForSector(seats, "PB_DER");
    pbDerSeats[0].status = "OCCUPIED";
    pbDerSeats[1].status = "OCCUPIED";
    pbDerSeats[2].status = "OCCUPIED";

    const selectedIds = [pbDerSeats[3].id, pbDerSeats[4].id];

    const metrics = calculateSectorMetrics(seats, selectedIds, USHER_SECTORS.PB_DER);
    expect(metrics.total).toBe(33);
    expect(metrics.occupied).toBe(3);
    expect(metrics.available).toBe(30);
    expect(metrics.selected).toBe(2);
    expect(metrics.occupancyPercent).toBe(Math.round((3 / 33) * 100));
  });

  it("agrupa correctamente las butacas por fila preservando el orden descendente", () => {
    const pbIzqSeats = filterSeatsForSector(allSeats, "PB_IZQ");
    const grouped = groupSectorSeatsByRow(pbIzqSeats);

    expect(Object.keys(grouped)).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
    // Fila A: Asientos 12 a 6
    expect(grouped.A.map((s) => s.number)).toEqual([12, 11, 10, 9, 8, 7, 6]);
    // Fila D: Asientos 10 a 4
    expect(grouped.D.map((s) => s.number)).toEqual([10, 9, 8, 7, 6, 5, 4]);
  });

  it("ejecuta confirmación de ingreso en lote para múltiples butacas familiares en 1 solo paso", () => {
    const state = loadInitialState();
    const eventId = state.events[0].id;
    const initialSeats = generateInitialSeats();
    state.seatsByEvent[eventId] = initialSeats;

    const targetIds = ["PB-A-01", "PB-A-02", "PB-A-03"];

    // Verificar que inicialmente estén disponibles
    const seatsBefore = state.seatsByEvent[eventId].filter((s) => targetIds.includes(s.id));
    expect(seatsBefore.every((s) => s.status === "AVAILABLE")).toBe(true);

    // Confirmar ingreso del grupo en lote
    const stateAfterCheckIn = executeBatchSetSeatOccupancy(
      state,
      eventId,
      targetIds,
      "OCCUPIED"
    );
    const seatsAfter = stateAfterCheckIn.seatsByEvent[eventId].filter((s) =>
      targetIds.includes(s.id)
    );
    expect(seatsAfter.every((s) => s.status === "OCCUPIED")).toBe(true);

    // Liberar grupo en lote
    const stateAfterRelease = executeBatchSetSeatOccupancy(
      stateAfterCheckIn,
      eventId,
      targetIds,
      "AVAILABLE"
    );
    const seatsReleased = stateAfterRelease.seatsByEvent[eventId].filter((s) =>
      targetIds.includes(s.id)
    );
    expect(seatsReleased.every((s) => s.status === "AVAILABLE")).toBe(true);
  });
});
