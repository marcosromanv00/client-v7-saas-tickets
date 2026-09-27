import { Seat } from "../tickets/types";

export interface BlueprintRowLayout {
  left: Seat[];
  right: Seat[];
  outer?: Seat[];
  hasAisle: boolean;
  showWheelchair?: boolean;
}

export function splitRowByBlueprint(rowLetter: string, rowSeats: Seat[]): BlueprintRowLayout {
  if (rowLetter === "A" || rowLetter === "B" || rowLetter === "C") {
    return {
      left: rowSeats.filter((s) => s.number <= 5),
      right: rowSeats.filter((s) => s.number > 5),
      hasAisle: true,
    };
  }

  if (rowLetter === "D" || rowLetter === "E") {
    return {
      left: rowSeats.filter((s) => s.number <= 3),
      right: rowSeats.filter((s) => s.number > 3),
      hasAisle: true,
      showWheelchair: true,
    };
  }

  if (rowLetter === "F" || rowLetter === "G") {
    return {
      left: rowSeats.filter((s) => s.number <= 6),
      right: rowSeats.filter((s) => s.number > 6),
      hasAisle: true,
    };
  }

  if (rowLetter === "H") {
    return {
      left: [],
      right: rowSeats,
      hasAisle: true,
    };
  }

  if (rowLetter === "I" || rowLetter === "J" || rowLetter === "K" || rowLetter === "L") {
    return {
      left: rowSeats.filter((s) => s.number <= 7),
      right: rowSeats.filter((s) => s.number > 7),
      hasAisle: true,
    };
  }

  if (rowLetter === "M") {
    return {
      left: rowSeats.filter((s) => s.number <= 7),
      right: rowSeats.filter((s) => s.number > 7 && s.number <= 12),
      outer: rowSeats.filter((s) => s.number > 12),
      hasAisle: true,
    };
  }

  // N, Ñ, O, P, Q, R: Balcón Superior (disposición continua)
  return {
    left: rowSeats,
    right: [],
    hasAisle: false,
  };
}
