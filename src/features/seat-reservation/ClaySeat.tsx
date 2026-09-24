import { motion } from "motion/react";
import { Seat } from "../tickets/types";

interface ClaySeatProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  disabled?: boolean;
}

export function ClaySeat({ seat, isSelected, onSelect, disabled = false }: ClaySeatProps) {
  const isAvailable = seat.status === "AVAILABLE";
  const isOccupied = seat.status === "OCCUPIED" || seat.status === "RESERVED";
  const isVip = seat.isVip;

  let stateClass = "clay-seat-available text-slate-700 dark:text-slate-200";
  if (isSelected) {
    stateClass = "clay-seat-selected text-white font-bold";
  } else if (isOccupied) {
    stateClass = "clay-seat-occupied text-slate-400 dark:text-slate-600";
  } else if (isVip) {
    stateClass = "clay-seat-vip text-[#c59223] dark:text-amber-300 font-semibold";
  }

  const isClickable = isAvailable && !disabled;

  return (
    <motion.button
      type="button"
      layout
      whileHover={isClickable ? { scale: 1.15, y: -2 } : undefined}
      whileTap={isClickable ? { scale: 0.92 } : undefined}
      animate={{ scale: isSelected ? 1.12 : 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 24 }}
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      aria-label={`Butaca ${seat.label} - ${isSelected ? "Seleccionada" : seat.status}`}
      className={`group relative flex flex-col items-center justify-between w-7 h-8.5 sm:w-8.5 sm:h-10 select-none transition-all p-0.5 ${
        isClickable ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"
      }`}
    >
      {/* 1. COJÍN DEL ASIENTO (HACIA EL ESCENARIO • PARTE SUPERIOR) */}
      <div className="relative w-full flex items-center justify-between">
        {/* Apoyabrazos izquierdo */}
        <div
          className={`w-1 sm:w-1.5 h-3.5 sm:h-4 rounded-full transition-colors ${
            isSelected
              ? "bg-[#003c80] dark:bg-blue-400"
              : isOccupied
              ? "bg-slate-300 dark:bg-slate-700"
              : isVip
              ? "bg-[#c59223] dark:bg-amber-400"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />

        {/* Superficie del asiento acolchado con número mirando al proscenio */}
        <div
          className={`flex-1 h-4 sm:h-5 mx-0.5 rounded-t-md flex items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold tracking-tighter transition-all duration-200 ${stateClass}`}
        >
          {seat.number}
        </div>

        {/* Apoyabrazos derecho */}
        <div
          className={`w-1 sm:w-1.5 h-3.5 sm:h-4 rounded-full transition-colors ${
            isSelected
              ? "bg-[#003c80] dark:bg-blue-400"
              : isOccupied
              ? "bg-slate-300 dark:bg-slate-700"
              : isVip
              ? "bg-[#c59223] dark:bg-amber-400"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
      </div>

      {/* 2. RESPALDO ERGONÓMICO DE LA BUTACA (EN LA PARTE POSTERIOR • INFERIOR) */}
      <div
        className={`w-5 sm:w-6 h-3 sm:h-3.5 rounded-b-lg border-t-0 transition-all duration-200 ${stateClass}`}
      />

      {/* Distintivo VIP Protocolario */}
      {isVip && !isSelected && (
        <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-[#c59223] dark:bg-amber-400 shadow-xs shadow-amber-500/50" />
      )}
    </motion.button>
  );
}

export const SeatItem = ClaySeat;
