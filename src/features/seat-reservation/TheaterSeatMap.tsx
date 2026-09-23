import { Seat } from "../tickets/types";
import { SeatItem } from "./SeatItem";
import { groupSeatsByRow } from "../tickets/theater-layout";

interface TheaterSeatMapProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: Seat) => void;
  allowVipSelection?: boolean;
}

export function TheaterSeatMap({ seats, selectedSeatId, onSelectSeat, allowVipSelection = false }: TheaterSeatMapProps) {
  const seatsByRow = groupSeatsByRow(seats);

  const plantaBajaRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const balconRows = ["K", "L", "M", "N", "O"];

  const renderRow = (rowLetter: string, splitIndex: number) => {
    const rowSeats = seatsByRow[rowLetter] || [];
    const isVipRow = rowLetter === "A" || rowLetter === "K";
    const leftBlock = rowSeats.slice(0, splitIndex);
    const rightBlock = rowSeats.slice(splitIndex);

    return (
      <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3 py-1">
        {/* Letra de fila a la izquierda */}
        <span className={`w-5 text-right font-mono text-xs font-semibold ${isVipRow ? "text-amber-600" : "text-slate-400"}`}>
          {rowLetter}
        </span>

        {/* Bloque Izquierdo */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {leftBlock.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={selectedSeatId === seat.id}
              onSelect={onSelectSeat}
              disabled={seat.isVip && !allowVipSelection}
            />
          ))}
        </div>

        {/* Pasillo Central */}
        <div className="w-4 sm:w-6 border-x border-dashed border-slate-200 h-6 flex items-center justify-center">
          <span className="sr-only">Pasillo central</span>
        </div>

        {/* Bloque Derecho */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {rightBlock.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={selectedSeatId === seat.id}
              onSelect={onSelectSeat}
              disabled={seat.isVip && !allowVipSelection}
            />
          ))}
        </div>

        {/* Letra de fila a la derecha */}
        <span className={`w-5 text-left font-mono text-xs font-semibold ${isVipRow ? "text-amber-600" : "text-slate-400"}`}>
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-xs overflow-x-auto">
      {/* Escenario Teatral */}
      <div className="max-w-lg mx-auto mb-8 text-center">
        <div className="h-9 bg-[#1b2a4a] text-amber-300 rounded-t-full flex items-center justify-center text-xs tracking-widest font-mono uppercase shadow-sm">
          Escenario Principal
        </div>
        <div className="h-1 bg-amber-400/80 mx-8 rounded-full shadow-xs" />
        <span className="text-[11px] text-slate-400 font-mono mt-1 block">Frente de Sala / Telón de Boca</span>
      </div>

      {/* Sección 1: Planta Baja (120 Butacas) */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
          <div>
            <h3 className="font-serif text-sm font-medium text-[#1b2a4a]">Planta Baja — Platea Central</h3>
            <p className="text-[11px] text-slate-400">120 Butacas • Filas A a J (Fila A: Protocolo Municipal)</p>
          </div>
        </div>
        <div className="min-w-fit flex flex-col items-center">
          {plantaBajaRows.map((r) => renderRow(r, 6))}
        </div>
      </div>

      {/* Sección 2: Segunda Planta / Balcón (70 Butacas) */}
      <div className="pt-4 border-t-2 border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
          <div>
            <h3 className="font-serif text-sm font-medium text-[#1b2a4a]">Segunda Planta — Balcón Superior</h3>
            <p className="text-[11px] text-slate-400">70 Butacas • Filas K a O (Fila K: Invitados Especiales)</p>
          </div>
        </div>
        <div className="min-w-fit flex flex-col items-center">
          {balconRows.map((r) => renderRow(r, 7))}
        </div>
      </div>

      {/* Leyenda Canónica */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-slate-200 border border-slate-300" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-amber-500 border border-amber-600 shadow-xs" />
          <span>Seleccionada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-[#233858] border border-amber-400 text-amber-300 flex items-center justify-center text-[10px] font-mono">
            VIP
          </div>
          <span>Protocolo Municipal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-slate-400 opacity-60" />
          <span>Reservada / Ocupada</span>
        </div>
      </div>
    </div>
  );
}
