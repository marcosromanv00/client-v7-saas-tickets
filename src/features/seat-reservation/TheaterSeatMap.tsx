import React from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { ClaySeat } from "./ClaySeat";
import { groupSeatsByRow } from "../tickets/theater-layout";

interface TheaterSeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  allowVipSelection?: boolean;
}

export const TheaterSeatMap: React.FC<TheaterSeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  allowVipSelection = false,
}) => {
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
          <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
            <span className={`w-4 text-right font-mono text-[10px] ${isVip ? "text-amber-400 font-bold" : "text-zinc-500"}`}>
              {rowLetter}
            </span>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {leftBlock.map((seat) => (
                <ClaySeat
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeatIds.includes(seat.id)}
                  onSelect={onToggleSeat}
                  disabled={seat.isVip && !allowVipSelection}
                />
              ))}
            </div>

            {/* Pasillo central teatral (espacio negativo arquitectónico) */}
            <div className="w-2.5 sm:w-4 h-6 flex items-center justify-center">
              <span className="w-px h-full bg-zinc-800/60" />
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {rightBlock.map((seat) => (
                <ClaySeat
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeatIds.includes(seat.id)}
                  onSelect={onToggleSeat}
                  disabled={seat.isVip && !allowVipSelection}
                />
              ))}
            </div>

            <span className={`w-4 text-left font-mono text-[10px] ${isVip ? "text-amber-400 font-bold" : "text-zinc-500"}`}>
              {rowLetter}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#151020]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* 1. ESCENARIO CURVO CON ARCO DE NEÓN Y RESPLANDOR */}
      <div className="relative max-w-sm sm:max-w-md mx-auto mb-6 text-center">
        <div className="relative w-full h-8 flex items-center justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 320 40" fill="none">
            <motion.path
              d="M 10 35 Q 160 -5 310 35"
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="drop-shadow-[0_0_16px_rgba(244,63,94,0.8)]"
            />
          </svg>
        </div>
        <div className="w-48 h-6 bg-rose-500/10 rounded-full blur-xl mx-auto -mt-4 pointer-events-none" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-rose-300/90 font-medium block">
          ESCENARIO PRINCIPAL • SALA CÍVICA
        </span>
      </div>

      {/* 2. PLANTA BAJA (120 BUTACAS • FILAS A - J) */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-fit flex flex-col items-center">
          <div className="mb-2 px-3 py-0.5 rounded-full bg-zinc-900/80 border border-white/5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Planta Baja • Platea Central (120 Asientos)
          </div>
          {renderRowBlock(plantaBajaRows, 6)}
        </div>
      </div>

      {/* 3. PLANTA ALTA / BALCÓN (70 BUTACAS • FILAS K - O) */}
      <div className="mt-4 pt-4 border-t border-white/10 overflow-x-auto pb-2">
        <div className="min-w-fit flex flex-col items-center">
          <div className="mb-2 px-3 py-0.5 rounded-full bg-zinc-900/80 border border-white/5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Planta Alta • Balcón Histórico (70 Asientos)
          </div>
          {renderRowBlock(plantaAltaRows, 7)}
        </div>
      </div>

      {/* 4. LEYENDA VISUAL DE ESTADOS DE BUTACAS */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm clay-seat-available" />
          <span className="text-[11px]">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm clay-seat-selected" />
          <span className="text-[11px] font-medium text-rose-300">Seleccionada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm clay-seat-occupied" />
          <span className="text-[11px] text-zinc-500">Ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm clay-seat-vip" />
          <span className="text-[11px] text-amber-300">Protocolo VIP</span>
        </div>
      </div>
    </div>
  );
};
