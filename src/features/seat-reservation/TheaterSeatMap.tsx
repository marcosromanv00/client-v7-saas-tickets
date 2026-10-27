import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Seat } from "../tickets/types";
import { TheaterBlockId } from "./theater-blocks.config";
import { TheaterMacroBlocksView } from "./TheaterMacroBlocksView";
import { TheaterBlockDetailView } from "./TheaterBlockDetailView";
import { TheaterSeatMapLegend } from "./TheaterSeatMapLegend";

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
    <div className="bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-teatro-navy-border p-2 sm:p-3 shadow-2xs relative select-none transition-all w-full min-w-0">
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

      <div className="mt-2">
        <TheaterSeatMapLegend />
      </div>
    </div>
  );
};
