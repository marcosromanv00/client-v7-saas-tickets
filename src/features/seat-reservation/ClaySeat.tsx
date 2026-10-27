import { motion } from "motion/react";
import { Seat } from "../tickets/types";

interface ClaySeatProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  disabled?: boolean;
  compact?: boolean;
  zoomed?: boolean;
  allowToggleOccupied?: boolean;
}

export function ClaySeat({
  seat,
  isSelected,
  onSelect,
  disabled = false,
  compact = false,
  zoomed = false,
  allowToggleOccupied = false,
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

  const isClickable = (isAvailable || allowToggleOccupied) && !disabled;

  const sizeClass = zoomed
    ? "w-6 h-7 sm:w-8 sm:h-9"
    : compact
    ? "w-4.5 h-5.5 sm:w-7 sm:h-8"
    : "w-5.5 h-6.5 sm:w-7.5 sm:h-8.5";

  const fontSizeClass = zoomed
    ? "text-[10px] sm:text-xs"
    : compact
    ? "text-[7px] sm:text-[9px]"
    : "text-[8px] sm:text-[10px]";

  return (
    <motion.button
      type="button"
      whileHover={isClickable ? { scale: 1.1, y: -1 } : undefined}
      whileTap={isClickable ? { scale: 0.94 } : undefined}
      animate={{ scale: isSelected ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      aria-label={`Butaca ${seat.label} - ${isSelected ? "Seleccionada" : seat.status}`}
      className={`group relative rounded-md sm:rounded-lg flex flex-col items-center justify-between select-none transition-all p-0.5 touch-manipulation ${sizeClass} ${stateClass} ${
        isClickable ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"
      }`}
    >
      {/* Respaldo superior sutil */}
      <div
        className={`w-3/4 h-1 rounded-full transition-colors ${
          isSelected
            ? "bg-white/40"
            : isOccupied
            ? "bg-slate-300/40 dark:bg-slate-700/40"
            : isVip
            ? "bg-amber-400/60 dark:bg-amber-400/40"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
      />

      {/* Número de butaca centrado */}
      <span className={`font-mono font-bold leading-none tracking-tight ${fontSizeClass}`}>
        {seat.number}
      </span>

      {/* Base acolchada inferior */}
      <div
        className={`w-full h-1 rounded-b-xs transition-colors ${
          isSelected
            ? "bg-black/10"
            : isOccupied
            ? "bg-transparent"
            : "bg-black/5 dark:bg-white/5"
        }`}
      />

      {/* Distintivo VIP Protocolario */}
      {isVip && !isSelected && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teatro-gold dark:bg-amber-400 shadow-xs shadow-amber-500/50" />
      )}
    </motion.button>
  );
}

export const SeatItem = ClaySeat;
