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

  let stateClass = "clay-seat-available text-zinc-300";
  if (isSelected) {
    stateClass = "clay-seat-selected text-white font-bold";
  } else if (isOccupied) {
    stateClass = "clay-seat-occupied text-zinc-600";
  } else if (isVip) {
    stateClass = "clay-seat-vip text-amber-300";
  }

  const isClickable = isAvailable && !disabled;

  return (
    <motion.button
      type="button"
      layout
      whileHover={isClickable ? { scale: 1.18, y: -2 } : undefined}
      whileTap={isClickable ? { scale: 0.88 } : undefined}
      animate={{ scale: isSelected ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 24 }}
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      aria-label={`Butaca ${seat.label} - ${isSelected ? "Seleccionada" : seat.status}`}
      className={`group relative flex flex-col items-center justify-between w-6 h-7.5 sm:w-7 sm:h-9 select-none transition-all ${
        isClickable ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"
      }`}
    >
      {/* Respaldo ergonómico de la butaca */}
      <div
        className={`w-4.5 sm:w-5.5 h-3 sm:h-3.5 rounded-t-lg transition-all duration-200 ${stateClass}`}
      />

      {/* Cojín del asiento con apoyabrazos gemelos */}
      <div className="relative w-full flex items-center justify-between px-0.5">
        {/* Apoyabrazos izquierdo */}
        <div
          className={`w-1 h-3 rounded-full transition-colors ${
            isSelected
              ? "bg-rose-400"
              : isOccupied
              ? "bg-zinc-800"
              : isVip
              ? "bg-amber-600/70"
              : "bg-zinc-700/80"
          }`}
        />

        {/* Asiento acolchado central */}
        <div
          className={`flex-1 h-3.5 sm:h-4 mx-0.5 rounded-b-md flex items-center justify-center text-[8px] sm:text-[9px] font-mono transition-all duration-200 ${stateClass}`}
        >
          {seat.number}
        </div>

        {/* Apoyabrazos derecho */}
        <div
          className={`w-1 h-3 rounded-full transition-colors ${
            isSelected
              ? "bg-rose-400"
              : isOccupied
              ? "bg-zinc-800"
              : isVip
              ? "bg-amber-600/70"
              : "bg-zinc-700/80"
          }`}
        />
      </div>

      {/* Corona / Distintivo VIP */}
      {isVip && !isSelected && (
        <span className="absolute -top-1 right-0 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" />
      )}
    </motion.button>
  );
}

export const SeatItem = ClaySeat;
