import { motion } from "motion/react";
import { Seat } from "../tickets/types";

interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  disabled?: boolean;
}

export function SeatItem({ seat, isSelected, onSelect, disabled = false }: SeatItemProps) {
  const isAvailable = seat.status === "AVAILABLE";
  const isOccupied = seat.status === "OCCUPIED";
  const isReserved = seat.status === "RESERVED";

  let backrestBg = "bg-slate-700 group-hover:bg-slate-600";
  let cushionBg = "bg-slate-800 group-hover:bg-slate-700";
  let armrestBg = "bg-slate-600/70";
  let textColor = "text-slate-300 group-hover:text-white";

  if (isSelected) {
    backrestBg = "bg-cyan-400";
    cushionBg = "bg-cyan-500 shadow-lg shadow-cyan-500/50";
    armrestBg = "bg-cyan-300";
    textColor = "text-slate-950 font-bold";
  } else if (seat.isVip && isAvailable) {
    backrestBg = "bg-indigo-900/90";
    cushionBg = "bg-indigo-950 border border-amber-400/50";
    armrestBg = "bg-amber-400/70";
    textColor = "text-amber-300";
  } else if (isOccupied || isReserved) {
    backrestBg = "bg-[#831843]";
    cushionBg = "bg-[#500724]";
    armrestBg = "bg-[#9d174d]/80";
    textColor = "text-pink-300/40";
  }

  const isClickable = isAvailable && !disabled;

  return (
    <motion.button
      type="button"
      layout
      whileHover={isClickable ? { scale: 1.12, y: -1 } : undefined}
      whileTap={isClickable ? { scale: 0.88 } : undefined}
      animate={{ scale: isSelected ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      aria-label={`Butaca ${seat.label} - ${isSelected ? "Seleccionada" : seat.status}`}
      className={`group relative flex flex-col items-center justify-between w-6 h-7 sm:w-7 sm:h-8.5 select-none ${
        isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-80"
      }`}
    >
      {/* Respaldo de la butaca */}
      <div className={`w-4 sm:w-5 h-2.5 sm:h-3 rounded-t-sm transition-colors duration-150 ${backrestBg}`} />

      {/* Cojín central con apoyabrazos gemelos */}
      <div className="relative w-full flex items-center justify-between">
        <div className={`w-0.5 sm:w-1 h-3 rounded-xs ${armrestBg}`} />
        <div className={`flex-1 h-3.5 sm:h-4 mx-0.5 rounded-b-xs flex items-center justify-center text-[8px] sm:text-[9px] font-mono transition-colors duration-150 ${cushionBg} ${textColor}`}>
          {seat.number}
        </div>
        <div className={`w-0.5 sm:w-1 h-3 rounded-xs ${armrestBg}`} />
      </div>

      {/* Indicador VIP */}
      {seat.isVip && !isSelected && (
        <span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
      )}
    </motion.button>
  );
}
