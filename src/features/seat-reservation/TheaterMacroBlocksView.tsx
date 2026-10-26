import React from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { TheaterBlockId } from "./theater-blocks.config";
import { ZoomIn } from "lucide-react";

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
  const bgClass = isViolet
    ? "bg-violet-50/90 dark:bg-violet-950/40 border-violet-300 dark:border-violet-800/80 hover:border-violet-500"
    : "bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 hover:border-rose-500";
  const labelColor = isViolet ? "text-violet-600 dark:text-violet-400" : "text-rose-600 dark:text-rose-400";
  const countColor = isViolet ? "text-violet-700 dark:text-violet-300" : "text-rose-700 dark:text-rose-300";
  const iconColor = isViolet ? "text-violet-500" : "text-rose-500";
  const borderDivider = isViolet ? "border-violet-200/60 dark:border-violet-800/60" : "border-rose-200/60 dark:border-rose-800/60";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between min-h-[105px] overflow-hidden ${bgClass}`}
    >
      {hasNotch && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-7 bg-white dark:bg-[#0b1a30] border-l border-y border-violet-300 dark:border-violet-800/80 rounded-l-md pointer-events-none" />
      )}
      <div>
        <div className="flex items-center justify-between">
          <span className={`text-2xs font-mono font-bold uppercase ${labelColor}`}>{levelLabel}</span>
          <ZoomIn className={`w-3.5 h-3.5 ${iconColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">{title}</h4>
      </div>
      <div className={`mt-2 pt-2 border-t ${borderDivider} flex items-baseline justify-between font-mono`}>
        <span className={`text-lg sm:text-xl font-bold ${countColor}`}>
          {available}<span className="text-xs text-slate-400 font-normal">/{total}</span>
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">libres</span>
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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 py-2 select-none">
      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
        Plano Arquitectónico de Sala • Toca un sector para ampliar
      </span>

      {/* 1. Nivel 3: Balcón Superior (Izquierda 49 / Derecha 36 con Muesca) */}
      <div className="w-full grid grid-cols-2 gap-3 items-stretch">
        <SectorCard
          levelLabel="Nivel 3 • Izq"
          title="Balcón Izquierdo"
          available={balLeftAvail}
          total={balLeftTotal}
          theme="violet"
          onClick={() => onSelectBlock("BALCON_ALTO")}
        />
        <SectorCard
          levelLabel="Nivel 3 • Der"
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
        <span className="w-12 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-[9px] font-mono uppercase text-slate-400 dark:text-slate-600">Pasillo de Acceso</span>
        <span className="w-12 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 2. Nivel 2: Nivel Medio (Filas H-M con Pasillo Central) */}
      <div className="w-full grid grid-cols-2 gap-3 items-stretch">
        <SectorCard
          levelLabel="Nivel 2 • Izq"
          title="Sector Izquierdo"
          available={nmLeftAvail}
          total={nmLeftTotal}
          theme="rose"
          onClick={() => onSelectBlock("NIVEL_MEDIO")}
        />
        <SectorCard
          levelLabel="Nivel 2 • Der"
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
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => onSelectBlock("PLATEA_BAJA")}
        className="w-full p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 hover:border-amber-500 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between min-h-[95px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-2xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
              Nivel 1 • Frente al Escenario
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Platea Baja Frontal (Filas A - G)
            </h4>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 group-hover:border-amber-400 transition-colors">
            <ZoomIn className="w-3.5 h-3.5 text-amber-500" />
            <span>Ver Butacas</span>
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/60 flex items-baseline justify-between font-mono">
          <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
            {pbAvail}<span className="text-xs text-slate-400 font-normal">/{pbTotal}</span>
          </span>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {Math.round((pbAvail / pbTotal) * 100)}% disponible
          </span>
        </div>
      </motion.button>

      {/* Escenario Principal (Base del plano) */}
      <div className="w-full flex flex-col items-center pt-0.5">
        <div className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-md">
          <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase">
            ── ESCENARIO PRINCIPAL ──
          </span>
        </div>
      </div>
    </div>
  );
};
