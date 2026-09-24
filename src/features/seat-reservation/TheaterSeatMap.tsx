import React, { useState } from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { ClaySeat } from "./ClaySeat";
import { groupSeatsByRow, PLATEA_BAJA_ROWS, NIVEL_MEDIO_ROWS, BALCON_ALTO_ROWS } from "../tickets/theater-layout";

interface TheaterSeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  allowVipSelection?: boolean;
}

type ActiveLevel = "TODOS" | "PLATEA_BAJA" | "NIVEL_MEDIO" | "BALCON_ALTO";

export const TheaterSeatMap: React.FC<TheaterSeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  allowVipSelection = false,
}) => {
  const [activeZone, setActiveZone] = useState<ActiveLevel>("TODOS");
  const seatsByRow = groupSeatsByRow(seats);

  const pbCount = seats.filter((s) => s.zone === "PLATEA_BAJA" || PLATEA_BAJA_ROWS.includes(s.row as any)).length;
  const nmCount = seats.filter((s) => s.zone === "NIVEL_MEDIO" || NIVEL_MEDIO_ROWS.includes(s.row as any)).length;
  const balconCount = seats.filter((s) => s.zone === "BALCON_ALTO" || s.zone === "BALCON").length;

  const renderRowBlock = (rows: readonly string[], isSingleBlock = false) => (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      {rows.map((rowLetter) => {
        const rowSeats = seatsByRow[rowLetter] || [];
        const isVip = rowLetter === "A" || rowLetter === "K";
        const splitIndex = Math.ceil(rowSeats.length / 2);
        const leftBlock = isSingleBlock ? rowSeats : rowSeats.slice(0, splitIndex);
        const rightBlock = isSingleBlock ? [] : rowSeats.slice(splitIndex);

        return (
          <div key={rowLetter} className="flex items-center justify-center gap-1 sm:gap-1.5">
            <span className={`w-3.5 text-right font-mono text-[9px] sm:text-[10px] ${isVip ? "text-teatro-gold dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
              {rowLetter}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {leftBlock.map((seat) => (
                <ClaySeat key={seat.id} seat={seat} isSelected={selectedSeatIds.includes(seat.id)} onSelect={onToggleSeat} disabled={seat.isVip && !allowVipSelection} />
              ))}
            </div>
            {!isSingleBlock && (
              <>
                <div className="w-2 sm:w-3.5 h-6 flex items-center justify-center">
                  <span className="w-px h-full bg-slate-200 dark:bg-slate-700/60" />
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {rightBlock.map((seat) => (
                    <ClaySeat key={seat.id} seat={seat} isSelected={selectedSeatIds.includes(seat.id)} onSelect={onToggleSeat} disabled={seat.isVip && !allowVipSelection} />
                  ))}
                </div>
              </>
            )}
            <span className={`w-3.5 text-left font-mono text-[9px] sm:text-[10px] ${isVip ? "text-teatro-gold dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
              {rowLetter}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-3 sm:p-5 shadow-sm relative select-none transition-colors">
      {/* 1. ESCENARIO COMPACTO CON ARCO DE NEÓN */}
      <div className="relative max-w-sm mx-auto mb-2 text-center">
        <div className="relative w-full h-6 flex items-center justify-center">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 320 28" fill="none">
            <motion.path d="M 12 24 Q 160 -2 308 24" stroke="#004ea2" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_6px_rgba(0,78,162,0.4)] dark:stroke-[#38bdf8]" />
          </svg>
        </div>
        <span className="text-[9px] font-mono tracking-widest uppercase text-teatro-blue dark:text-blue-400 font-bold block -mt-1">
          ESCENARIO • TEATRO MUNICIPAL DE ALAJUELA
        </span>
      </div>

      {/* 2. SELECTOR DE NIVELES (3 NIVELES ARQUITECTÓNICOS + TODOS) */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-3 flex-wrap">
        {[
          { id: "TODOS" as ActiveLevel, label: "Todos", count: pbCount + nmCount + balconCount },
          { id: "PLATEA_BAJA" as ActiveLevel, label: "Nivel 1: Platea", count: pbCount },
          { id: "NIVEL_MEDIO" as ActiveLevel, label: "Nivel 2: Medio", count: nmCount },
          { id: "BALCON_ALTO" as ActiveLevel, label: "Nivel 3: Balcón", count: balconCount },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveZone(tab.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeZone === tab.id
                ? "bg-teatro-blue text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#071324] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#102444] border border-slate-200 dark:border-teatro-navy-border"
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono font-bold">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* 3. MATRIZ DE BUTACAS POR NIVEL Y PASARELA DE ACCESO */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit flex flex-col items-center">
          {/* NIVEL 1: PLATEA BAJA */}
          {(activeZone === "TODOS" || activeZone === "PLATEA_BAJA") && (
            <div className="w-full flex flex-col items-center mb-2">
              <span className="text-[9px] font-mono uppercase text-slate-400 mb-1">Nivel 1: Platea Baja (62 butacas)</span>
              {renderRowBlock(PLATEA_BAJA_ROWS, false)}
            </div>
          )}

          {/* PASARELA / DESCANSO PRINCIPAL Y ACCESO POR LA IZQUIERDA DESDE LOBBY */}
          {(activeZone === "TODOS" || activeZone === "PLATEA_BAJA" || activeZone === "NIVEL_MEDIO") && (
            <div className="w-full max-w-lg my-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-dashed border-teatro-blue/30 dark:border-blue-500/30 flex items-center justify-between gap-2 text-[10px] font-mono select-none">
              <div className="flex items-center gap-1.5 text-muni-red dark:text-red-400 font-bold">
                <span className="px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/40">
                  🚪 Acceso Lobby (Izquierda)
                </span>
                <span className="text-slate-400 hidden sm:inline">➔ Pasillo al teatro</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Descanso Central</span>
                <span className="px-1.5 py-0.5 rounded-md bg-teatro-blue/10 dark:bg-blue-900/30 text-teatro-blue dark:text-blue-300 font-bold">
                  Gradas a Nivel Medio ⇡
                </span>
              </div>
            </div>
          )}

          {/* NIVEL 2: NIVEL MEDIO */}
          {(activeZone === "TODOS" || activeZone === "NIVEL_MEDIO") && (
            <div className="w-full flex flex-col items-center mb-3">
              <span className="text-[9px] font-mono uppercase text-slate-400 mb-1">Nivel 2: Nivel Medio (96 butacas)</span>
              {renderRowBlock(NIVEL_MEDIO_ROWS, false)}
            </div>
          )}

          {/* NIVEL 3: BALCÓN SUPERIOR */}
          {(activeZone === "TODOS" || activeZone === "BALCON_ALTO") && (
            <div className={`w-full flex flex-col items-center ${activeZone === "TODOS" ? "pt-2 border-t border-slate-200 dark:border-teatro-navy-border" : ""}`}>
              <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                Nivel 3: Balcón Superior (62 butacas)
              </div>
              {renderRowBlock(BALCON_ALTO_ROWS, true)}
            </div>
          )}
        </div>
      </div>

      {/* 4. LEYENDA VISUAL COMPACTA */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-teatro-navy-border flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-xs clay-seat-available" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-xs clay-seat-selected" />
          <span className="text-[10px] font-semibold text-teatro-blue dark:text-blue-400">Seleccionada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-xs clay-seat-occupied" />
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-xs clay-seat-vip" />
          <span className="text-[10px] text-teatro-gold dark:text-amber-400 font-semibold">Protocolo VIP</span>
        </div>
      </div>
    </div>
  );
};
