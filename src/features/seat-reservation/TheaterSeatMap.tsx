import { motion } from "motion/react";
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
  const plantaAltaRows = ["K", "L", "M", "N", "O"];

  const renderRowBlock = (rows: string[], splitIndex: number) => (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {rows.map((rowLetter) => {
        const rowSeats = seatsByRow[rowLetter] || [];
        const isVip = rowLetter === "A" || rowLetter === "K";
        const leftBlock = rowSeats.slice(0, splitIndex);
        const rightBlock = rowSeats.slice(splitIndex);

        return (
          <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2.5">
            <span className={`w-4 text-right font-mono text-[10px] sm:text-[11px] ${isVip ? "text-amber-400 font-bold" : "text-slate-500"}`}>
              {rowLetter}
            </span>

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

            {/* Pasillo central teatral */}
            <div className="w-2.5 sm:w-4 h-6 flex items-center justify-center">
              <span className="w-px h-full bg-slate-800/80" />
            </div>

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

            <span className={`w-4 text-left font-mono text-[10px] sm:text-[11px] ${isVip ? "text-amber-400 font-bold" : "text-slate-500"}`}>
              {rowLetter}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#0b101d]/95 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-4 sm:p-7 shadow-2xl relative overflow-hidden select-none">
      {/* 1. ESCENARIO CURVO ILUMINADO */}
      <div className="relative max-w-sm sm:max-w-md mx-auto mb-6 text-center">
        <div className="relative w-full h-8 flex items-center justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 300 40" fill="none">
            <motion.path
              d="M 10 35 Q 150 -5 290 35"
              stroke="#e5a93c"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="drop-shadow-[0_0_14px_rgba(229,169,60,0.9)]"
            />
          </svg>
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-semibold -mt-1 block">
          ESCENARIO PRINCIPAL • TEATRO MUNICIPAL
        </span>
      </div>

      {/* 2. PLANTA BAJA (120 BUTACAS • FILAS A - J) */}
      <div className="overflow-x-auto pb-3">
        <div className="min-w-fit flex flex-col items-center">
          <div className="mb-2 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Planta Baja • Platea (120 Butacas)
          </div>
          {renderRowBlock(plantaBajaRows, 6)}
        </div>
      </div>

      {/* 3. DIVISIÓN ARQUITECTÓNICA Y PLANTA ALTA (70 BUTACAS • FILAS K - O) */}
      <div className="overflow-x-auto pt-4 pb-2 border-t border-slate-800/80 mt-4">
        <div className="min-w-fit flex flex-col items-center">
          <div className="mb-2.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 uppercase tracking-wider">
            Planta Alta • Balcón (70 Butacas)
          </div>
          {renderRowBlock(plantaAltaRows, 7)}
        </div>
      </div>

      {/* LEYENDA CANÓNICA */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#831843]" />
          <span>Ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span>Seleccionada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 border border-amber-400" />
          <span>VIP Protocolo (Fila A / K)</span>
        </div>
      </div>
    </div>
  );
}
