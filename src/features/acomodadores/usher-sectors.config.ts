import { Seat } from "../tickets/types";

export type UsherSectorId =
  | "PB_IZQ"
  | "PB_DER"
  | "MED_IZQ"
  | "MED_DER"
  | "BAL_IZQ"
  | "BAL_DER";

export interface UsherSectorConfig {
  id: UsherSectorId;
  name: string;
  shortName: string;
  levelLabel: string;
  totalSeats: number;
  rows: readonly string[];
  themeColor: {
    accent: string;
    lightFill: string;
    darkFill: string;
    lightHover: string;
    darkHover: string;
    lightStroke: string;
    darkStroke: string;
  };
  svgPath: string;
  labelPosition: { x: number; y: number };
  statPosition: { x: number; y: number };
}

export const USHER_SECTORS: Record<UsherSectorId, UsherSectorConfig> = {
  PB_IZQ: {
    id: "PB_IZQ",
    name: "Platea Baja Izquierda",
    shortName: "Platea Izquierda",
    levelLabel: "NIVEL 1",
    totalSeats: 49,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    themeColor: {
      accent: "#f59e0b",
      lightFill: "rgba(245, 158, 11, 0.08)",
      darkFill: "rgba(197, 146, 35, 0.16)",
      lightHover: "rgba(245, 158, 11, 0.18)",
      darkHover: "rgba(197, 146, 35, 0.28)",
      lightStroke: "#d97706",
      darkStroke: "rgba(245, 158, 11, 0.55)",
    },
    svgPath: "M 60,82 L 255,82 L 255,224 L 60,224 Z",
    labelPosition: { x: 157, y: 142 },
    statPosition: { x: 157, y: 168 },
  },
  PB_DER: {
    id: "PB_DER",
    name: "Platea Baja Derecha",
    shortName: "Platea Derecha",
    levelLabel: "NIVEL 1",
    totalSeats: 33,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    themeColor: {
      accent: "#f59e0b",
      lightFill: "rgba(245, 158, 11, 0.08)",
      darkFill: "rgba(197, 146, 35, 0.16)",
      lightHover: "rgba(245, 158, 11, 0.18)",
      darkHover: "rgba(197, 146, 35, 0.28)",
      lightStroke: "#d97706",
      darkStroke: "rgba(245, 158, 11, 0.55)",
    },
    svgPath:
      "M 285,82 L 460,82 L 460,144 L 416,144 L 416,184 L 480,184 L 480,224 L 285,224 Z",
    labelPosition: { x: 360, y: 128 },
    statPosition: { x: 360, y: 154 },
  },
  MED_IZQ: {
    id: "MED_IZQ",
    name: "Sector Medio Izquierdo",
    shortName: "Medio Izquierdo",
    levelLabel: "NIVEL 2",
    totalSeats: 27,
    rows: ["I", "J", "K", "L", "M"],
    themeColor: {
      accent: "#004ea2",
      lightFill: "rgba(0, 78, 162, 0.07)",
      darkFill: "rgba(0, 78, 162, 0.18)",
      lightHover: "rgba(0, 78, 162, 0.16)",
      darkHover: "rgba(0, 78, 162, 0.32)",
      lightStroke: "#004ea2",
      darkStroke: "rgba(56, 189, 248, 0.5)",
    },
    svgPath:
      "M 115,288 L 255,288 L 255,394 L 60,394 L 60,364 L 115,364 Z",
    labelPosition: { x: 185, y: 332 },
    statPosition: { x: 185, y: 358 },
  },
  MED_DER: {
    id: "MED_DER",
    name: "Sector Medio Derecho",
    shortName: "Medio Derecho",
    levelLabel: "NIVEL 2",
    totalSeats: 42,
    rows: ["H", "I", "J", "K", "L", "M"],
    themeColor: {
      accent: "#004ea2",
      lightFill: "rgba(0, 78, 162, 0.07)",
      darkFill: "rgba(0, 78, 162, 0.18)",
      lightHover: "rgba(0, 78, 162, 0.16)",
      darkHover: "rgba(0, 78, 162, 0.32)",
      lightStroke: "#004ea2",
      darkStroke: "rgba(56, 189, 248, 0.5)",
    },
    svgPath: "M 285,266 L 480,266 L 480,394 L 285,394 Z",
    labelPosition: { x: 382, y: 320 },
    statPosition: { x: 382, y: 346 },
  },
  BAL_IZQ: {
    id: "BAL_IZQ",
    name: "Balcón Izquierdo",
    shortName: "Balcón Izquierdo",
    levelLabel: "NIVEL 3",
    totalSeats: 32,
    rows: ["N", "Ñ", "O", "P", "Q", "R"],
    themeColor: {
      accent: "#6366f1",
      lightFill: "rgba(99, 102, 241, 0.07)",
      darkFill: "rgba(99, 102, 241, 0.15)",
      lightHover: "rgba(99, 102, 241, 0.16)",
      darkHover: "rgba(99, 102, 241, 0.28)",
      lightStroke: "#6366f1",
      darkStroke: "rgba(167, 139, 250, 0.5)",
    },
    svgPath:
      "M 115,428 L 255,428 L 255,560 L 60,560 L 60,524 L 115,524 Z",
    labelPosition: { x: 185, y: 476 },
    statPosition: { x: 185, y: 502 },
  },
  BAL_DER: {
    id: "BAL_DER",
    name: "Balcón Derecho",
    shortName: "Balcón Derecho",
    levelLabel: "NIVEL 3",
    totalSeats: 42,
    rows: ["N", "Ñ", "O", "P", "Q", "R"],
    themeColor: {
      accent: "#6366f1",
      lightFill: "rgba(99, 102, 241, 0.07)",
      darkFill: "rgba(99, 102, 241, 0.15)",
      lightHover: "rgba(99, 102, 241, 0.16)",
      darkHover: "rgba(99, 102, 241, 0.28)",
      lightStroke: "#6366f1",
      darkStroke: "rgba(167, 139, 250, 0.5)",
    },
    svgPath: "M 285,428 L 480,428 L 480,560 L 285,560 Z",
    labelPosition: { x: 382, y: 484 },
    statPosition: { x: 382, y: 510 },
  },
};

export const USHER_SECTOR_LIST: UsherSectorConfig[] = [
  USHER_SECTORS.PB_IZQ,
  USHER_SECTORS.PB_DER,
  USHER_SECTORS.MED_IZQ,
  USHER_SECTORS.MED_DER,
  USHER_SECTORS.BAL_IZQ,
  USHER_SECTORS.BAL_DER,
];

export function isSeatInSector(seat: Seat, sectorId: UsherSectorId): boolean {
  const row = seat.row;
  const num = seat.number;

  switch (sectorId) {
    case "PB_DER":
      if (!["A", "B", "C", "D", "E", "F", "G"].includes(row)) return false;
      if (["A", "B", "C"].includes(row)) return num >= 1 && num <= 5;
      if (["D", "E"].includes(row)) return num >= 1 && num <= 3;
      if (["F", "G"].includes(row)) return num >= 1 && num <= 6;
      return false;

    case "PB_IZQ":
      if (!["A", "B", "C", "D", "E", "F", "G"].includes(row)) return false;
      if (["A", "B", "C"].includes(row)) return num >= 6 && num <= 12;
      if (["D", "E"].includes(row)) return num >= 4 && num <= 10;
      if (["F", "G"].includes(row)) return num >= 7 && num <= 13;
      return false;

    case "MED_DER":
      return ["H", "I", "J", "K", "L", "M"].includes(row) && num >= 1 && num <= 7;

    case "MED_IZQ":
      if (row === "H") return false;
      if (["I", "J", "K", "L"].includes(row)) return num >= 8 && num <= 12;
      if (row === "M") return num >= 8 && num <= 14;
      return false;

    case "BAL_DER":
      return ["N", "Ñ", "O", "P", "Q", "R"].includes(row) && num >= 1 && num <= 7;

    case "BAL_IZQ":
      if (["N", "Ñ", "O", "P", "Q"].includes(row)) return num >= 8 && num <= 12;
      if (row === "R") return num >= 8 && num <= 14;
      return false;
  }
}
