import { useState } from "react";
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
  const [activeZone, setActiveZone] = useState<"PLANTA_BAJA" | "BALCON">("PLANTA_BAJA");
  const seatsByRow = groupSeatsByRow(seats);

  const plantaBajaRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const balconRows = ["K", "L", "M", "N", "O"];

  const currentRows = activeZone === "PLANTA_BAJA" ? plantaBajaRows : balconRows;
  const splitIndex = activeZone === "PLANTA_BAJA" ? 6 : 7;

  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md rounded-3xl border border-slate-800/90 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Selector de Niveles con Indicador Deslizante Fluid Layout */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 relative">
          <button
            type="button"
            onClick={() => setActiveZone("PLANTA_BAJA")}
            className={`relative z-10 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeZone === "PLANTA_BAJA" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {activeZone === "PLANTA_BAJA" && (
              <motion.div
                layoutId="levelTabBg"
                className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/30"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10">Platea • Planta Baja (120)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveZone("BALCON")}
            className={`relative z-10 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeZone === "BALCON" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {activeZone === "BALCON" && (
              <motion.div
                layoutId="levelTabBg"
                className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/30"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10">Balcón • 2da Planta (70)</span>
          </button>
        </div>
      </div>

      {/* Escenario Curvo Iluminado con Resplandor Teatral */}
      <div className="relative max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-10 text-center select-none">
        <div className="relative w-full h-8 sm:h-10 flex items-center justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 300 40" fill="none">
            <motion.path
              d="M 10 35 Q 150 -5 290 35"
              stroke="#e5a93c"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="drop-shadow-[0_0_12px_rgba(229,169,60,0.85)]"
            />
          </svg>
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 -mt-2 block">
          Escenario Principal • Teatro Municipal
        </span>
      </div>

      {/* Cuadrícula de Butacas con Pasillo Central */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-fit flex flex-col items-center gap-1.5 sm:gap-2">
          {currentRows.map((rowLetter) => {
            const rowSeats = seatsByRow[rowLetter] || [];
            const isVip = rowLetter === "A" || rowLetter === "K";
            const leftBlock = rowSeats.slice(0, splitIndex);
            const rightBlock = rowSeats.slice(splitIndex);

            return (
              <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                <span className={`w-4 text-right font-mono text-[11px] ${isVip ? "text-amber-400 font-bold" : "text-slate-500"}`}>
                  {rowLetter}
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
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
                <div className="w-3 sm:w-5 h-6 flex items-center justify-center">
                  <span className="w-px h-full bg-slate-800/80" />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
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

                <span className={`w-4 text-left font-mono text-[11px] ${isVip ? "text-amber-400 font-bold" : "text-slate-500"}`}>
                  {rowLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda Canónica 1:1 con la Referencia */}
      <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-300">
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
          <span>VIP Protocolo</span>
        </div>
      </div>
    </div>
  );
}
