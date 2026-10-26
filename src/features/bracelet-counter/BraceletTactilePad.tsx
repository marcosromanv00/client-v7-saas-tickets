import React, { useState } from "react";
import { Plus, Minus, Undo2, RotateCcw, AlertOctagon } from "lucide-react";
import { BraceletMetrics } from "./bracelet-counter-types";

interface BraceletTactilePadProps {
  metrics: BraceletMetrics;
  onAddDelta: (delta: number, note?: string) => void;
  onReset: () => void;
  lastDeliveryDelta?: number;
}

export const BraceletTactilePad: React.FC<BraceletTactilePadProps> = ({
  metrics,
  onAddDelta,
  onReset,
  lastDeliveryDelta = 1,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isFull = metrics.status === "FULL";
  const effectiveUndo = Math.max(1, Math.min(lastDeliveryDelta, metrics.deliveredCount));

  const triggerHaptic = (ms: number = 30) => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const handleTap = (delta: number, label: string) => {
    triggerHaptic(delta < 0 ? 40 : 25);
    onAddDelta(delta, label);
  };

  return (
    <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-2xs space-y-2 select-none">
      {/* 1. Botón Principal de Entrega Rápida (+1) */}
      <button
        type="button"
        disabled={isFull}
        onClick={() => handleTap(1, "Ingreso (+1)")}
        className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] touch-manipulation cursor-pointer ${
          isFull
            ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60"
            : "bg-teatro-blue hover:bg-teatro-blue-hover dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-900/15"
        }`}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Entregar +1 Brazalete</span>
        <span className="text-2xs font-mono font-normal opacity-80 ml-1">
          {isFull ? "(Aforo Completo)" : "(1 toque)"}
        </span>
      </button>

      {/* 2. Botones de Suma en Lote (+2, +3, +5, +10) */}
      <div className="grid grid-cols-4 gap-1.5">
        {[2, 3, 5, 10].map((qty) => (
          <button
            key={`add-${qty}`}
            type="button"
            disabled={isFull || metrics.availableRemaining < qty}
            onClick={() => handleTap(qty, `Grupo (+${qty})`)}
            className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-teatro-blue dark:text-blue-400 font-mono font-bold text-xs transition-all active:scale-95 touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-0.5"
            title={`Entregar ${qty} brazaletes`}
          >
            <Plus className="w-3 h-3" />
            <span>{qty}</span>
          </button>
        ))}
      </div>

      {/* 3. Botones de Resta en Lote (-1, -2, -3, -5, -10) */}
      <div className="grid grid-cols-5 gap-1">
        {[1, 2, 3, 5, 10].map((qty) => (
          <button
            key={`sub-${qty}`}
            type="button"
            disabled={metrics.deliveredCount < qty}
            onClick={() => handleTap(-qty, `Corrección (-${qty})`)}
            className="py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200/70 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 font-mono font-semibold text-2xs transition-all active:scale-95 touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-0.5"
            title={`Restar ${qty} brazaletes`}
          >
            <Minus className="w-2.5 h-2.5" />
            <span>{qty}</span>
          </button>
        ))}
      </div>

      {/* 4. Barra Inferior de Reversión y Reinicio */}
      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          disabled={metrics.deliveredCount === 0}
          onClick={() => handleTap(-effectiveUndo, `Reversión (-${effectiveUndo})`)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/80 text-2xs font-semibold text-amber-800 dark:text-amber-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Undo2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Revertir ({effectiveUndo > 0 ? `-${effectiveUndo}` : "0"})</span>
        </button>

        {showConfirmReset ? (
          <div className="flex items-center gap-1 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                onReset();
                setShowConfirmReset(false);
              }}
              className="px-2 py-0.5 bg-muni-red text-white text-3xs font-bold rounded cursor-pointer"
            >
              Confirmar 0
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-1.5 py-0.5 text-slate-400 hover:text-slate-600 text-3xs cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 text-2xs font-medium text-slate-400 hover:text-muni-red dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Poner en 0</span>
          </button>
        )}
      </div>

      {isFull && (
        <div className="flex items-center gap-1.5 p-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-2xs text-muni-red dark:text-red-300 font-medium">
          <AlertOctagon className="w-3 h-3 shrink-0" />
          <span>Aforo completo ({metrics.totalCapacity}/{metrics.totalCapacity}).</span>
        </div>
      )}
    </div>
  );
};
