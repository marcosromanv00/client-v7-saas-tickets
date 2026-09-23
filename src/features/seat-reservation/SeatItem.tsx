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

  // Clases según estado
  let statusClasses = "bg-slate-200 text-slate-700 hover:bg-amber-100 hover:border-amber-400 border-slate-300";
  let title = `Butaca ${seat.label} - Disponible`;

  if (isSelected) {
    statusClasses = "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300";
    title = `Butaca ${seat.label} - Seleccionada`;
  } else if (seat.isVip && isAvailable) {
    statusClasses = "bg-[#233858] text-amber-300 border-amber-400/40 hover:bg-[#2c446c]";
    title = `Butaca ${seat.label} - Fila VIP Protocolo`;
  } else if (isOccupied) {
    statusClasses = "bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-80";
    title = `Butaca ${seat.label} - Ocupada en sala`;
  } else if (isReserved) {
    statusClasses = "bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed opacity-60";
    title = `Butaca ${seat.label} - Reservada`;
  }

  const isClickable = isAvailable && !disabled;

  return (
    <button
      type="button"
      onClick={() => isClickable && onSelect(seat)}
      disabled={!isClickable}
      title={title}
      aria-label={title}
      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-md rounded-b-sm border text-[10px] sm:text-xs font-mono font-medium flex items-center justify-center transition-all duration-150 select-none ${statusClasses}`}
    >
      <span>{seat.number}</span>
      {seat.isVip && !isSelected && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" />
      )}
    </button>
  );
}
