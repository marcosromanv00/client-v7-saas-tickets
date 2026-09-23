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

  // Estilos según el estado y arquetipo de cine
  let backrestBg = "bg-slate-700/80 group-hover:bg-slate-600";
  let cushionBg = "bg-slate-800 group-hover:bg-slate-700";
  let armrestBg = "bg-slate-600/60";
  let textColor = "text-slate-400 group-hover:text-slate-200";

  if (isSelected) {
    backrestBg = "bg-amber-400";
    cushionBg = "bg-amber-500 shadow-md shadow-amber-500/40";
    armrestBg = "bg-amber-300";
    textColor = "text-slate-950 font-bold";
  } else if (seat.isVip && isAvailable) {
    backrestBg = "bg-[#253966]";
    cushionBg = "bg-[#182847] border border-amber-400/40";
    armrestBg = "bg-amber-400/60";
    textColor = "text-amber-300";
  } else if (isOccupied || isReserved) {
    backrestBg = "bg-[#3d182b]/90";
    cushionBg = "bg-[#2a111e]";
    armrestBg = "bg-[#4f2038]/60";
    textColor = "text-pink-300/40";
  }

  const isClickable = isAvailable && !disabled;

  return (
    <button
      type="button"
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      aria-label={`Butaca ${seat.label} - ${isSelected ? "Seleccionada" : seat.status}`}
      className={`group relative flex flex-col items-center justify-between w-6 h-7 sm:w-7 sm:h-8.5 select-none transition-transform duration-100 ${
        isClickable ? "cursor-pointer active:scale-90 hover:-translate-y-0.5" : "cursor-not-allowed opacity-80"
      }`}
    >
      {/* Respaldo de la butaca */}
      <div className={`w-4 sm:w-5 h-2.5 sm:h-3 rounded-t-sm transition-colors ${backrestBg}`} />

      {/* Cojín central con reposabrazos laterales */}
      <div className="relative w-full flex items-center justify-between">
        {/* Reposabrazo Izquierdo */}
        <div className={`w-0.5 sm:w-1 h-3 rounded-xs ${armrestBg}`} />
        {/* Cojín Principal */}
        <div className={`flex-1 h-3.5 sm:h-4 mx-0.5 rounded-b-xs flex items-center justify-center text-[8px] sm:text-[9px] font-mono transition-colors ${cushionBg} ${textColor}`}>
          {seat.number}
        </div>
        {/* Reposabrazo Derecho */}
        <div className={`w-0.5 sm:w-1 h-3 rounded-xs ${armrestBg}`} />
      </div>

      {/* Punto VIP */}
      {seat.isVip && !isSelected && (
        <span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
      )}
    </button>
  );
}
