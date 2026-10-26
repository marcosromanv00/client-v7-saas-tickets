import React from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { ClaySeat } from "./ClaySeat";
import { groupSeatsByRow } from "../tickets/theater-layout";
import { splitRowByBlueprint } from "./theater-seat-map.utils";
import {
  THEATER_BLOCKS,
  THEATER_BLOCK_LIST,
  TheaterBlockId,
  calculateBlockMetrics,
} from "./theater-blocks.config";
import { ArrowLeft } from "lucide-react";

interface TheaterBlockDetailViewProps {
  blockId: TheaterBlockId;
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  allowVipSelection?: boolean;
  onBackToMacro: () => void;
  onSelectBlock: (blockId: TheaterBlockId) => void;
  onFillRow?: (rowLetter: string, fill: boolean) => void;
}

export const TheaterBlockDetailView: React.FC<TheaterBlockDetailViewProps> = ({
  blockId,
  seats,
  selectedSeatIds,
  onToggleSeat,
  allowVipSelection = false,
  onBackToMacro,
  onSelectBlock,
  onFillRow,
}) => {
  const currentBlock = THEATER_BLOCKS[blockId];
  const seatsByRow = groupSeatsByRow(seats);
  const metrics = calculateBlockMetrics(seats, selectedSeatIds, currentBlock);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className="w-full flex flex-col items-center select-none"
    >
      {/* 1. Navegación Rápida y Selector de Bloque */}
      <div className="w-full flex items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToMacro}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-2xs font-semibold transition-all cursor-pointer touch-manipulation shrink-0"
        >
          <ArrowLeft className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {THEATER_BLOCK_LIST.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBlock(b.id)}
              className={`px-2 py-0.5 rounded text-2xs font-mono font-medium transition-all cursor-pointer touch-manipulation ${
                b.id === blockId
                  ? `${b.themeColor.pillBg} shadow-2xs font-bold`
                  : "bg-slate-100 dark:bg-[#071324] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {b.shortName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-2xs font-mono shrink-0">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentBlock.themeColor.accent }} />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {metrics.available}<span className="font-normal text-slate-400">/{metrics.total}</span>
          </span>
          {metrics.selected > 0 && (
            <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-bold">
              ({metrics.selected} sel)
            </span>
          )}
        </div>
      </div>

      {/* 3. Parrilla de Butacas con Zoom Aumentado */}
      <div className="w-full overflow-x-auto pb-4 pt-1">
        <div className="min-w-fit mx-auto flex flex-col items-center gap-1.5 sm:gap-2">
          {currentBlock.rows.map((rowLetter) => {
            const rowSeats = seatsByRow[rowLetter] || [];
            const isVip = rowLetter === "A" || rowLetter === "N";
            const layout = splitRowByBlueprint(rowLetter, rowSeats);
            const isRowFull = rowSeats.length > 0 && rowSeats.every((s) => s.status !== "AVAILABLE");

            return (
              <div key={rowLetter} className="flex items-center justify-center gap-1 sm:gap-2 w-full">
                {/* Etiqueta Izquierda de Fila */}
                <span className={`w-4 sm:w-5 text-center font-mono text-[10px] sm:text-xs shrink-0 ${isVip ? "text-teatro-gold dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500 font-semibold"}`}>
                  {rowLetter}
                </span>

                {/* Bloque Izquierdo: Anclado a la derecha hacia el pasillo central */}
                <div className="w-[260px] sm:w-[360px] flex items-center justify-end gap-1 sm:gap-1.5 shrink-0">
                  {layout.outerLeft && layout.outerLeft.length > 0 && (
                    <div className="flex items-center gap-1 sm:gap-1.5 mr-1 sm:mr-1.5">
                      {layout.outerLeft.map((seat) => (
                        <ClaySeat key={seat.id} seat={seat} isSelected={selectedSeatIds.includes(seat.id)} onSelect={onToggleSeat} disabled={seat.isVip && !allowVipSelection} zoomed={true} />
                      ))}
                    </div>
                  )}
                  {layout.left.map((seat) => (
                    <ClaySeat key={seat.id} seat={seat} isSelected={selectedSeatIds.includes(seat.id)} onSelect={onToggleSeat} disabled={seat.isVip && !allowVipSelection} zoomed={true} />
                  ))}
                </div>

                {/* Pasillo Central con Línea Guía Vertical */}
                {layout.hasAisle ? (
                  <div className="w-3 sm:w-5 h-7 sm:h-9 flex items-center justify-center shrink-0">
                    <span className="w-px h-full bg-slate-200 dark:bg-slate-700/80" />
                  </div>
                ) : (
                  <div className="w-2 sm:w-3 shrink-0" />
                )}

                {/* Bloque Derecho: Anclado a la izquierda desde el pasillo central */}
                <div className="w-[230px] sm:w-[320px] flex items-center justify-start gap-1 sm:gap-1.5 shrink-0">
                  {layout.right.map((seat) => (
                    <ClaySeat key={seat.id} seat={seat} isSelected={selectedSeatIds.includes(seat.id)} onSelect={onToggleSeat} disabled={seat.isVip && !allowVipSelection} zoomed={true} />
                  ))}
                  {layout.showWheelchair && (
                    <div className="flex items-center gap-1 ml-1 sm:ml-1.5">
                      <span className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center select-none" title="Accesible Ley 7600">♿</span>
                      <span className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center select-none" title="Accesible Ley 7600">♿</span>
                    </div>
                  )}
                </div>

                {/* Etiqueta Derecha de Fila */}
                <span className={`w-4 sm:w-5 text-center font-mono text-[10px] sm:text-xs shrink-0 ${isVip ? "text-teatro-gold dark:text-amber-400 font-bold" : "text-slate-400 dark:text-slate-500 font-semibold"}`}>
                  {rowLetter}
                </span>

                {/* Botón Acción Rápida por Fila (+Fila / ✓ Llena) */}
                {onFillRow && (
                  <button
                    type="button"
                    onClick={() => onFillRow(rowLetter, !isRowFull)}
                    className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold transition-all cursor-pointer ${
                      isRowFull
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        : "bg-teatro-blue/15 text-teatro-blue dark:text-blue-400 hover:bg-teatro-blue/25"
                    }`}
                    title={isRowFull ? "Liberar fila completa" : "Ocupar fila completa"}
                  >
                    {isRowFull ? "✓ Llena" : "+Fila"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
