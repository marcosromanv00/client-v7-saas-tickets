import { motion } from "motion/react";
import { Seat } from "../tickets/types";

interface ClaySeatProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  disabled?: boolean;
  compact?: boolean;
  zoomed?: boolean;
}

export function ClaySeat({
  seat,
  isSelected,
  onSelect,
  disabled = false,
  compact = false,
  zoomed = false,
}: ClaySeatProps) {
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

  const sizeClass = zoomed
    ? "w-7.5 h-9.5 sm:w-10 sm:h-12"
    : compact
    ? "w-4.5 h-6 sm:w-8 sm:h-9.5"
    : "w-6 h-7.5 sm:w-8.5 sm:h-10";

  const fontSizeClass = zoomed
    ? "text-[10px] sm:text-[12px]"
    : compact
    ? "text-[7px] sm:text-[10px]"
    : "text-[8px] sm:text-[10px]";

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
      className={`group relative flex flex-col items-center justify-between select-none transition-all p-0 sm:p-0.5 touch-manipulation ${sizeClass} ${
        isClickable ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"
      }`}
    >
      {/* 1. COJÍN DEL ASIENTO (HACIA EL ESCENARIO • PARTE SUPERIOR) */}
      <div className="relative w-full flex items-center justify-between">
        {/* Apoyabrazos izquierdo */}
        <div
          className={`${zoomed ? "w-1 sm:w-2 h-3.5 sm:h-5" : "w-0.5 sm:w-1.5 h-2.5 sm:h-4"} rounded-full transition-colors ${
            isSelected
              ? "bg-teatro-blue-hover dark:bg-blue-400"
              : isOccupied
              ? "bg-slate-300 dark:bg-slate-700"
              : isVip
              ? "bg-teatro-gold dark:bg-amber-400"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />

        {/* Superficie del asiento acolchado con número mirando al proscenio */}
        <div
          className={`flex-1 ${zoomed ? "h-4.5 sm:h-6" : "h-3.5 sm:h-5"} mx-0.5 rounded-t-xs sm:rounded-t-md flex items-center justify-center font-mono font-bold tracking-tighter leading-none transition-all duration-200 ${fontSizeClass} ${stateClass}`}
        >
          {seat.number}
        </div>

        {/* Apoyabrazos derecho */}
        <div
          className={`${zoomed ? "w-1 sm:w-2 h-3.5 sm:h-5" : "w-0.5 sm:w-1.5 h-2.5 sm:h-4"} rounded-full transition-colors ${
            isSelected
              ? "bg-teatro-blue-hover dark:bg-blue-400"
              : isOccupied
              ? "bg-slate-300 dark:bg-slate-700"
              : isVip
              ? "bg-teatro-gold dark:bg-amber-400"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
      </div>

      {/* 2. RESPALDO ERGONÓMICO DE LA BUTACA (EN LA PARTE POSTERIOR • INFERIOR) */}
      <div
        className={`${zoomed ? "w-5 sm:w-7.5 h-2.5 sm:h-4" : "w-3 sm:w-6 h-1.5 sm:h-3.5"} rounded-b-xs sm:rounded-b-lg border-t-0 transition-all duration-200 ${stateClass}`}
      />

      {/* Distintivo VIP Protocolario */}
      {isVip && !isSelected && (
        <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-teatro-gold dark:bg-amber-400 shadow-xs shadow-amber-500/50" />
      )}
    </motion.button>
  );
}

export const SeatItem = ClaySeat;
