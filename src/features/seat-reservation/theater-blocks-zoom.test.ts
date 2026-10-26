import { describe, it, expect } from "vitest";
import { generateInitialSeats } from "../tickets/theater-layout";
import {
  THEATER_BLOCKS,
  THEATER_BLOCK_LIST,
  calculateBlockMetrics,
} from "./theater-blocks.config";
import { splitRowByBlueprint } from "./theater-seat-map.utils";

describe("Macro Bloques y Zoom Interactivo de Butacas", () => {
  it("contiene exactamente 3 bloques oficiales que suman las 225 butacas del teatro", () => {
    expect(THEATER_BLOCK_LIST.length).toBe(3);

    const platea = THEATER_BLOCKS.PLATEA_BAJA;
    const medio = THEATER_BLOCKS.NIVEL_MEDIO;
    const balcon = THEATER_BLOCKS.BALCON_ALTO;

    expect(platea.totalSeats).toBe(82);
    expect(medio.totalSeats).toBe(69);
    expect(balcon.totalSeats).toBe(74);

    const totalSeats = platea.totalSeats + medio.totalSeats + balcon.totalSeats;
    expect(totalSeats).toBe(225);
  });

  it("calcula métricas de disponibilidad y butacas seleccionadas por bloque sin efectos colaterales", () => {
    const seats = generateInitialSeats();
    const platea = THEATER_BLOCKS.PLATEA_BAJA;
    const balcon = THEATER_BLOCKS.BALCON_ALTO;

    // Seleccionar 2 butacas en Platea (primeras 2) y 1 en Balcón (última)
    const selectedSeatIds = [seats[0].id, seats[1].id, seats[seats.length - 1].id];

    const plateaMetrics = calculateBlockMetrics(seats, selectedSeatIds, platea);
    expect(plateaMetrics.total).toBe(82);
    expect(plateaMetrics.selected).toBe(2);
    expect(plateaMetrics.available).toBe(82);

    const balconMetrics = calculateBlockMetrics(seats, selectedSeatIds, balcon);
    expect(balconMetrics.total).toBe(74);
    expect(balconMetrics.selected).toBe(1);
    expect(balconMetrics.available).toBe(74);
  });

  it("particiona las filas de cada bloque respetando la geometría del plano oficial en la vista ampliada", () => {
    const seats = generateInitialSeats();
    const rowsPlatea = THEATER_BLOCKS.PLATEA_BAJA.rows;
    const rowsMedio = THEATER_BLOCKS.NIVEL_MEDIO.rows;
    const rowsBalcon = THEATER_BLOCKS.BALCON_ALTO.rows;

    expect(rowsPlatea).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
    expect(rowsMedio).toEqual(["H", "I", "J", "K", "L", "M"]);
    expect(rowsBalcon).toEqual(["N", "Ñ", "O", "P", "Q", "R"]);

    // Verificar que la fila D del bloque Platea tenga los espacios de silla de ruedas
    const rowD = seats.filter((s) => s.row === "D");
    const splitD = splitRowByBlueprint("D", rowD);
    expect(splitD.showWheelchair).toBe(true);
    expect(splitD.right.length).toBe(3);

    // Verificar que la fila H del bloque Medio reserve los 7 slots vacíos a la izquierda
    const rowH = seats.filter((s) => s.row === "H");
    const splitH = splitRowByBlueprint("H", rowH);
    expect(splitH.emptyLeftSlots).toBe(7);
    expect(splitH.right.length).toBe(7);

    // Verificar que la fila M del bloque Medio reserve las 2 butacas exteriores de descanso
    const rowM = seats.filter((s) => s.row === "M");
    const splitM = splitRowByBlueprint("M", rowM);
    expect(splitM.outerLeft?.length).toBe(2);
  });
});
