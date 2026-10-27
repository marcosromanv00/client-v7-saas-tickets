import React from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { TheaterBlockId } from "./theater-blocks.config";

interface TheaterMacroBlocksViewProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSelectBlock: (blockId: TheaterBlockId) => void;
}

interface SectorCardProps {
  levelLabel: string;
  title: string;
  available: number;
  total: number;
  theme: "violet" | "rose";
  hasNotch?: boolean;
  onClick: () => void;
}

const SectorCard: React.FC<SectorCardProps> = ({
  levelLabel,
  title,
  available,
  total,
  theme,
  hasNotch,
  onClick,
}) => {
  const isViolet = theme === "violet";
  const hoverBorder = isViolet ? "hover:border-indigo-400 dark:hover:border-indigo-500" : "hover:border-rose-400 dark:hover:border-rose-500";
  const countColor = isViolet ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400";
  const tagColor = isViolet ? "text-indigo-500/80 dark:text-indigo-400/80" : "text-rose-500/80 dark:text-rose-400/80";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`relative p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800/90 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between overflow-hidden ${hoverBorder}`}
    >
      {hasNotch && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-4 bg-white dark:bg-[#0b1a30] border-l border-y border-slate-200 dark:border-slate-800 rounded-l-xs pointer-events-none"
          title="Columna técnica del teatro"
        />
      )}
      <div className="flex items-center justify-between gap-1 w-full">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
          {title}
        </h4>
        <span className={`text-3xs font-mono font-bold uppercase shrink-0 ${tagColor}`}>
          {levelLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 font-mono w-full">
        <span className={`text-xs sm:text-sm font-bold ${countColor}`}>
          {available} <span className="text-3xs font-normal opacity-80 font-sans">libres</span>
        </span>
        <span className="text-3xs text-slate-400">
          de {total}
        </span>
      </div>
    </motion.button>
  );
};

export const TheaterMacroBlocksView: React.FC<TheaterMacroBlocksViewProps> = ({
  seats,
  onSelectBlock,
}) => {
  const pbSeats = seats.filter((s) => s.zone === "PLATEA_BAJA");
  const pbAvail = pbSeats.filter((s) => s.status === "AVAILABLE").length;
  const pbTotal = pbSeats.length || 82;

  const nmSeats = seats.filter((s) => s.zone === "NIVEL_MEDIO");
  const nmLeftAvail = nmSeats.filter((s) => s.number >= 8 && s.status === "AVAILABLE").length;
  const nmRightAvail = nmSeats.filter((s) => s.number <= 7 && s.status === "AVAILABLE").length;
  const nmLeftTotal = nmSeats.filter((s) => s.number >= 8).length || 35;
  const nmRightTotal = nmSeats.filter((s) => s.number <= 7).length || 34;

  const balSeats = seats.filter((s) => s.zone === "BALCON_ALTO" || s.zone === "BALCON");
  const balLeftAvail = balSeats.filter((s) => s.number >= 8 && s.status === "AVAILABLE").length;
  const balRightAvail = balSeats.filter((s) => s.number <= 7 && s.status === "AVAILABLE").length;
  const balLeftTotal = balSeats.filter((s) => s.number >= 8).length || 49;
  const balRightTotal = balSeats.filter((s) => s.number <= 7).length || 36;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-1.5 sm:gap-2 select-none">
      {/* 1. Nivel 3: Balcón Superior (Izquierda 49 / Derecha 36 con Muesca) */}
      <div className="w-full grid grid-cols-2 gap-2 items-stretch">
        <SectorCard
          levelLabel="Nivel 3"
          title="Balcón Izquierdo"
          available={balLeftAvail}
          total={balLeftTotal}
          theme="violet"
          onClick={() => onSelectBlock("BALCON_ALTO")}
        />
        <SectorCard
          levelLabel="Nivel 3"
          title="Balcón Derecho"
          available={balRightAvail}
          total={balRightTotal}
          theme="violet"
          hasNotch={true}
          onClick={() => onSelectBlock("BALCON_ALTO")}
        />
      </div>

      {/* Pasillo Transversal */}
      <div className="w-full flex items-center justify-center gap-2 py-0.5">
        <span className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-3xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Pasillo Central
        </span>
        <span className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 2. Nivel 2: Nivel Medio (Filas H-M) */}
      <div className="w-full grid grid-cols-2 gap-2 items-stretch">
        <SectorCard
          levelLabel="Nivel 2"
          title="Sector Izquierdo"
          available={nmLeftAvail}
          total={nmLeftTotal}
          theme="rose"
          onClick={() => onSelectBlock("NIVEL_MEDIO")}
        />
        <SectorCard
          levelLabel="Nivel 2"
          title="Sector Derecho"
          available={nmRightAvail}
          total={nmRightTotal}
          theme="rose"
          onClick={() => onSelectBlock("NIVEL_MEDIO")}
        />
      </div>

      {/* 3. Nivel 1: Platea Baja Frontal (Filas A-G, 82 butacas) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => onSelectBlock("PLATEA_BAJA")}
        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between w-full">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Platea Baja (Filas A - G)
          </h4>
          <span className="text-3xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
            Nivel 1 • Escenario
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 font-mono w-full">
          <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
            {pbAvail} <span className="text-3xs font-normal opacity-80 font-sans">libres</span>
          </span>
          <span className="text-3xs text-slate-400">
            de {pbTotal} butacas
          </span>
        </div>
      </motion.button>

      {/* Escenario Principal */}
      <div className="w-full flex flex-col items-center pt-0.5">
        <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-[#050f1d] dark:via-[#0c1f38] dark:to-[#050f1d] border border-slate-700/40 dark:border-[#1a355d] text-slate-200 flex items-center justify-center shadow-2xs">
          <span className="text-3xs font-mono font-bold tracking-[0.25em] uppercase text-slate-300 dark:text-blue-200">
            ── ESCENARIO PRINCIPAL ──
          </span>
        </div>
      </div>
    </div>
  );
};
