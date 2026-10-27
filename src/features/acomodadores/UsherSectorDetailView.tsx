import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Seat } from "../tickets/types";
import { ClaySeat } from "../seat-reservation/ClaySeat";
import {
  USHER_SECTORS,
  USHER_SECTOR_LIST,
  UsherSectorId,
} from "./usher-sectors.config";
import {
  calculateSectorMetrics,
  filterSeatsForSector,
  groupSectorSeatsByRow,
} from "./usher-sectors.utils";

interface UsherSectorDetailViewProps {
  sectorId: UsherSectorId;
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  onBackToMacro: () => void;
  onSelectSector: (sectorId: UsherSectorId) => void;
  onFillRow?: (rowLetter: string, fill: boolean) => void;
}

export const UsherSectorDetailView: React.FC<UsherSectorDetailViewProps> = ({
  sectorId,
  seats,
  selectedSeatIds,
  onToggleSeat,
  onBackToMacro,
  onSelectSector,
  onFillRow,
}) => {
  const currentSector = USHER_SECTORS[sectorId];
  const sectorSeats = filterSeatsForSector(seats, sectorId);
  const seatsByRow = groupSectorSeatsByRow(sectorSeats);
  const metrics = calculateSectorMetrics(seats, selectedSeatIds, currentSector);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 1. Barra de Navegación y Encabezado del Sector */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToMacro}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-all cursor-pointer touch-manipulation shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
          <span>Plano General</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="text-3xs uppercase tracking-wider font-sans font-bold text-slate-400 dark:text-slate-500">
            {currentSector.levelLabel}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.available} <span className="font-normal text-slate-400">/ {metrics.total} libres</span>
          </span>
          {metrics.selected > 0 && (
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              ({metrics.selected} sel)
            </span>
          )}
        </div>
      </div>

      {/* 2. Selector Segmentado de Sectores (Pill Strip con deslizamiento fluido) */}
      <div className="w-full overflow-x-auto pb-2 mb-2 scrollbar-none">
        <div className="flex items-center gap-1 min-w-max p-0.5 rounded-xl bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#162a4d]">
          {USHER_SECTOR_LIST.map((s) => {
            const isSelected = s.id === sectorId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSector(s.id)}
                className={`relative px-2.5 py-1 rounded-lg text-2xs font-sans transition-colors cursor-pointer touch-manipulation whitespace-nowrap ${
                  isSelected
                    ? "text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeSectorPill"
                    className="absolute inset-0 bg-teatro-blue rounded-lg shadow-xs"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{s.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Marco Adaptativo: bg-white en claro, bg-[#070e1b] en oscuro */}
      <div className="w-full rounded-2xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800/90 p-3 sm:p-4 shadow-sm dark:shadow-xl text-slate-900 dark:text-white transition-colors">
        {/* Línea Arquitectónica de Proscenio / Escenario */}
        <div className="w-full flex items-center justify-center gap-3 py-1 mb-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/70" />
          <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5">
            ▲ Escenario Principal
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/30 to-amber-500/70" />
        </div>

        {/* Parrilla de Butacas Inmediata (Sin parpadeo ni desvanecimiento a blanco) */}
        <div className="w-full overflow-x-auto pb-2 pt-1">
          <div className="min-w-fit mx-auto flex flex-col items-center gap-2">
            {currentSector.rows.map((rowLetter) => {
              const rowSeats = seatsByRow[rowLetter] || [];
              if (rowSeats.length === 0) return null;
              const isVip = rowLetter === "A" || rowLetter === "N";
              const isRowFull = rowSeats.every((s) => s.status !== "AVAILABLE");
              const showWheelchair = sectorId === "PB_DER" && (rowLetter === "D" || rowLetter === "E");

              return (
                <div
                  key={rowLetter}
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full"
                >
                  {/* Letra Izquierda de Fila */}
                  <span className={`w-4 text-center font-mono text-xs shrink-0 ${
                    isVip ? "text-amber-600 dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500 font-semibold"
                  }`}>
                    {rowLetter}
                  </span>

                  {/* Butacas del Sector (1 a la derecha, altos a la izquierda) */}
                  <div className="flex items-center justify-center gap-1.5 shrink-0">
                    {rowSeats.map((seat) => (
                      <ClaySeat
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeatIds.includes(seat.id)}
                        onSelect={onToggleSeat}
                        allowToggleOccupied={true}
                        zoomed={true}
                      />
                    ))}

                    {/* Espacios de Sillas de Ruedas Ley 7600 */}
                    {showWheelchair && (
                      <div className="flex items-center gap-1.5 ml-1" title="Espacio para sillas de ruedas Ley 7600">
                        <span className="w-6 h-7 sm:w-8 sm:h-9 rounded-md bg-sky-50 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs flex items-center justify-center select-none font-bold">
                          ♿
                        </span>
                        <span className="w-6 h-7 sm:w-8 sm:h-9 rounded-md bg-sky-50 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs flex items-center justify-center select-none font-bold">
                          ♿
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Letra Derecha de Fila */}
                  <span className={`w-4 text-center font-mono text-xs shrink-0 ${
                    isVip ? "text-amber-600 dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500 font-semibold"
                  }`}>
                    {rowLetter}
                  </span>

                  {/* Botón Acción Rápida por Fila */}
                  {onFillRow && (
                    <button
                      type="button"
                      onClick={() => onFillRow(rowLetter, !isRowFull)}
                      className={`ml-1 px-2 py-0.5 rounded text-[9px] font-mono transition-colors cursor-pointer border ${
                        isRowFull
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                          : "border-slate-300 dark:border-slate-700 hover:border-teatro-blue text-slate-500 dark:text-slate-400 hover:text-teatro-blue dark:hover:text-white"
                      }`}
                      title={isRowFull ? "Liberar fila completa de este sector" : "Ocupar fila completa de este sector"}
                    >
                      {isRowFull ? "✓ Llena" : "+Fila"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
