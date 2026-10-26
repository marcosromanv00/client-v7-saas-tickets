import { Seat } from "../tickets/types";
import { PLATEA_BAJA_ROWS, NIVEL_MEDIO_ROWS, BALCON_ALTO_ROWS } from "../tickets/theater-layout";

export type TheaterBlockId = "PLATEA_BAJA" | "NIVEL_MEDIO" | "BALCON_ALTO";

export interface TheaterBlockConfig {
  id: TheaterBlockId;
  name: string;
  shortName: string;
  levelLabel: string;
  rows: readonly string[];
  totalSeats: number;
  colorName: string;
  themeColor: {
    base: string;
    lightBg: string;
    darkBg: string;
    border: string;
    text: string;
    accent: string;
    pillBg: string;
  };
  description: string;
}

export interface TheaterBlockMetrics {
  total: number;
  available: number;
  occupied: number;
  selected: number;
}

export const THEATER_BLOCKS: Record<TheaterBlockId, TheaterBlockConfig> = {
  PLATEA_BAJA: {
    id: "PLATEA_BAJA",
    name: "Nivel 1: Platea Baja",
    shortName: "Platea Baja",
    levelLabel: "Nivel 1",
    rows: PLATEA_BAJA_ROWS,
    totalSeats: 82,
    colorName: "Ámbar Escénico",
    themeColor: {
      base: "from-amber-500/20 to-amber-600/10",
      lightBg: "bg-amber-50/80 hover:bg-amber-100/80",
      darkBg: "dark:bg-amber-950/30 dark:hover:bg-amber-900/40",
      border: "border-amber-400/50 dark:border-amber-500/40",
      text: "text-amber-700 dark:text-amber-300",
      accent: "#f59e0b",
      pillBg: "bg-amber-500 text-white shadow-amber-900/30",
    },
    description: "Frente al escenario principal. Filas A a G (82 butacas oficiales).",
  },
  NIVEL_MEDIO: {
    id: "NIVEL_MEDIO",
    name: "Nivel 2: Nivel Medio",
    shortName: "Nivel Medio",
    levelLabel: "Nivel 2",
    rows: NIVEL_MEDIO_ROWS,
    totalSeats: 69,
    colorName: "Rubí Coral",
    themeColor: {
      base: "from-rose-500/20 to-rose-600/10",
      lightBg: "bg-rose-50/80 hover:bg-rose-100/80",
      darkBg: "dark:bg-rose-950/30 dark:hover:bg-rose-900/40",
      border: "border-rose-400/50 dark:border-rose-500/40",
      text: "text-rose-700 dark:text-rose-300",
      accent: "#f43f5e",
      pillBg: "bg-rose-500 text-white shadow-rose-900/30",
    },
    description: "Sector intermedio con acceso a lobby y descanso. Filas H a M (69 butacas).",
  },
  BALCON_ALTO: {
    id: "BALCON_ALTO",
    name: "Nivel 3: Balcón Superior",
    shortName: "Balcón Alto",
    levelLabel: "Nivel 3",
    rows: BALCON_ALTO_ROWS,
    totalSeats: 74,
    colorName: "Violeta Panorámico",
    themeColor: {
      base: "from-violet-500/20 to-violet-600/10",
      lightBg: "bg-violet-50/80 hover:bg-violet-100/80",
      darkBg: "dark:bg-violet-950/30 dark:hover:bg-violet-900/40",
      border: "border-violet-400/50 dark:border-violet-500/40",
      text: "text-violet-700 dark:text-violet-300",
      accent: "#8b5cf6",
      pillBg: "bg-violet-500 text-white shadow-violet-900/30",
    },
    description: "Vista panorámica elevada del auditorio. Filas N a R (74 butacas).",
  },
};

export const THEATER_BLOCK_LIST: TheaterBlockConfig[] = [
  THEATER_BLOCKS.PLATEA_BAJA,
  THEATER_BLOCKS.NIVEL_MEDIO,
  THEATER_BLOCKS.BALCON_ALTO,
];

export function calculateBlockMetrics(
  seats: Seat[],
  selectedSeatIds: string[],
  blockConfig: TheaterBlockConfig
): TheaterBlockMetrics {
  const blockSeats = seats.filter((s) => blockConfig.rows.includes(s.row));
  const total = blockSeats.length || blockConfig.totalSeats;
  const selected = blockSeats.filter((s) => selectedSeatIds.includes(s.id)).length;
  const occupied = blockSeats.filter((s) => s.status !== "AVAILABLE").length;
  const available = Math.max(0, total - occupied);

  return { total, available, occupied, selected };
}
