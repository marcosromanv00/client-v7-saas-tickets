import { Seat } from "../tickets/types";

export interface BlueprintRowLayout {
  // Asientos en descanso de gradas exterior izquierdo (14 y 13 en fila M)
  outerLeft?: Seat[];
  // Bloque izquierdo (asientos de mayor numeración hacia la pared izquierda)
  left: Seat[];
  // Pasillo central
  hasAisle: boolean;
  // Bloque derecho (numeración descendente hacia asiento 1 en la pared derecha)
  right: Seat[];
  // Espacio accesible para sillas de ruedas (filas D y E junto a pared derecha)
  showWheelchair?: boolean;
  // Cantidad de columnas vacías en el sector izquierdo para fijar la cuadrícula
  emptyLeftSlots?: number;
}

export function splitRowByBlueprint(rowLetter: string, rowSeats: Seat[]): BlueprintRowLayout {
  const desc = (a: Seat, b: Seat) => b.number - a.number;

  // Filas A, B, C: 7 butacas a la izquierda (12..6) | pasillo | 5 butacas a la derecha (5..1)
  if (rowLetter === "A" || rowLetter === "B" || rowLetter === "C") {
    return {
      left: rowSeats.filter((s) => s.number >= 6).sort(desc),
      right: rowSeats.filter((s) => s.number < 6).sort(desc),
      hasAisle: true,
    };
  }

  // Filas D, E: 7 butacas a la izquierda (10..4) | pasillo | 3 butacas a la derecha (3..1) + sillas de ruedas
  if (rowLetter === "D" || rowLetter === "E") {
    return {
      left: rowSeats.filter((s) => s.number >= 4).sort(desc),
      right: rowSeats.filter((s) => s.number < 4).sort(desc),
      hasAisle: true,
      showWheelchair: true,
    };
  }

  // Filas F, G: 7 butacas a la izquierda (13..7) | pasillo | 6 butacas a la derecha (6..1)
  if (rowLetter === "F" || rowLetter === "G") {
    return {
      left: rowSeats.filter((s) => s.number >= 7).sort(desc),
      right: rowSeats.filter((s) => s.number < 7).sort(desc),
      hasAisle: true,
    };
  }

  // Fila H: 0 butacas a la izquierda (pasillo de acceso libre desde lobby) | 7 butacas a la derecha (7..1)
  if (rowLetter === "H") {
    return {
      left: [],
      right: rowSeats.filter((s) => s.number <= 7).sort(desc),
      hasAisle: true,
      emptyLeftSlots: 7,
    };
  }

  // Filas I, J, K, L: 5 butacas a la izquierda (12..8) | pasillo | 7 butacas a la derecha (7..1)
  if (rowLetter === "I" || rowLetter === "J" || rowLetter === "K" || rowLetter === "L") {
    return {
      left: rowSeats.filter((s) => s.number >= 8).sort(desc),
      right: rowSeats.filter((s) => s.number <= 7).sort(desc),
      hasAisle: true,
      emptyLeftSlots: 2,
    };
  }

  // Fila M: 2 exterior izq (14, 13) | gradas | 5 izq (12..8) | pasillo | 7 der (7..1)
  if (rowLetter === "M") {
    return {
      outerLeft: rowSeats.filter((s) => s.number >= 13).sort(desc),
      left: rowSeats.filter((s) => s.number >= 8 && s.number <= 12).sort(desc),
      right: rowSeats.filter((s) => s.number <= 7).sort(desc),
      hasAisle: true,
    };
  }

  // Fila R: 7 izq (14..8) + 7 der (7..1) continuas
  if (rowLetter === "R") {
    return {
      left: rowSeats.filter((s) => s.number >= 8).sort(desc),
      right: rowSeats.filter((s) => s.number <= 7).sort(desc),
      hasAisle: false,
    };
  }

  // Filas N, Ñ, O, P, Q (Balcón Superior): 5 izq (12..8) + 7 der (7..1) continuas
  return {
    left: rowSeats.filter((s) => s.number >= 8).sort(desc),
    right: rowSeats.filter((s) => s.number <= 7).sort(desc),
    hasAisle: false,
    emptyLeftSlots: 2,
  };
}
