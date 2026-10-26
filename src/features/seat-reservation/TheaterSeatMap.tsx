import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Seat } from "../tickets/types";
import { TheaterBlockId } from "./theater-blocks.config";
import { TheaterMacroBlocksView } from "./TheaterMacroBlocksView";
import { TheaterBlockDetailView } from "./TheaterBlockDetailView";
import { TheaterSeatMapLegend } from "./TheaterSeatMapLegend";
import { LayoutGrid, Layers } from "lucide-react";

interface TheaterSeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  allowVipSelection?: boolean;
  initialBlockId?: TheaterBlockId;
  onFillRow?: (rowLetter: string, fill: boolean) => void;
}

export const TheaterSeatMap: React.FC<TheaterSeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  allowVipSelection = false,
  initialBlockId,
  onFillRow,
}) => {
  // Estado de zoom: null = vista general por bloques (concierto); string = bloque con zoom
  const [selectedBlockId, setSelectedBlockId] = useState<TheaterBlockId | null>(
    () => initialBlockId || null
  );

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-3 sm:p-5 shadow-xs relative select-none transition-all">
      {/* Selector superior de modo de vista */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Layers className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {selectedBlockId ? "Vista con Zoom de Bloque" : "Vista por Zonas de Sala"}
          </span>
        </div>

        {selectedBlockId && (
          <button
            type="button"
            onClick={() => setSelectedBlockId(null)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Ver plano de bloques</span>
          </button>
        )}
      </div>

      {/* Transición fluida de Zoom entre Vista General y Detalle de Bloque */}
      <AnimatePresence mode="wait">
        {!selectedBlockId ? (
          <TheaterMacroBlocksView
            key="macro-view"
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSelectBlock={(blockId) => setSelectedBlockId(blockId)}
          />
        ) : (
          <TheaterBlockDetailView
            key={`detail-${selectedBlockId}`}
            blockId={selectedBlockId}
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
            allowVipSelection={allowVipSelection}
            onBackToMacro={() => setSelectedBlockId(null)}
            onSelectBlock={(blockId) => setSelectedBlockId(blockId)}
            onFillRow={onFillRow}
          />
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <TheaterSeatMapLegend />
      </div>
    </div>
  );
};
