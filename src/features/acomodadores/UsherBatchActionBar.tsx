import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, RotateCcw, X } from "lucide-react";
import { Seat } from "../tickets/types";

interface UsherBatchActionBarProps {
  selectedSeats: Seat[];
  onConfirmIngreso: () => void;
  onReleaseSeats: () => void;
  onClearSelection: () => void;
}

export const UsherBatchActionBar: React.FC<UsherBatchActionBarProps> = ({
  selectedSeats,
  onConfirmIngreso,
  onReleaseSeats,
  onClearSelection,
}) => {
  const count = selectedSeats.length;
  if (count === 0) return null;

  const hasOccupied = selectedSeats.some((s) => s.status === "OCCUPIED");
  const hasAvailable = selectedSeats.some((s) => s.status === "AVAILABLE");

  // Resumen de asientos seleccionados (ej: "A-01, A-02, A-03")
  const seatsSummary = selectedSeats
    .map((s) => `${s.row}-${s.number < 10 ? `0${s.number}` : s.number}`)
    .join(", ");

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        aria-label="Acciones en lote para butacas seleccionadas"
        className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg z-40 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-md border border-teatro-blue/30 dark:border-blue-500/30 rounded-2xl p-2.5 sm:p-3 shadow-xl text-slate-900 dark:text-white flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-teatro-blue dark:bg-blue-400 shrink-0" />
            <span className="font-bold truncate text-teatro-blue dark:text-blue-400">
              {count} {count === 1 ? "butaca seleccionada" : "butacas seleccionadas"}
            </span>
          </div>
          <p className="font-mono text-3xs text-slate-500 dark:text-slate-400 truncate max-w-[180px] sm:max-w-[260px]">
            {seatsSummary}
          </p>
          <button
            type="button"
            onClick={onClearSelection}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            title="Desmarcar todas"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasAvailable && (
            <button
              type="button"
              onClick={onConfirmIngreso}
              className="flex-1 py-2 px-3 rounded-xl bg-teatro-blue hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer touch-manipulation"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Confirmar Ingreso ({count})</span>
            </button>
          )}

          {hasOccupied && (
            <button
              type="button"
              onClick={onReleaseSeats}
              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 active:scale-[0.98] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
              title="Liberar butacas ocupadas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Liberar</span>
            </button>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
