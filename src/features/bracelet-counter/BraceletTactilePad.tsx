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
    triggerHaptic(delta < 0 ? 45 : 30);
    onAddDelta(delta, label);
  };

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs space-y-3.5 select-none">
      {/* 1. Botón Principal de Entrega Rápida (+1) */}
      <button
        type="button"
        disabled={isFull}
        onClick={() => handleTap(1, "Ingreso individual (+1)")}
        className={`w-full py-6 sm:py-7 px-5 rounded-2xl font-bold text-white text-lg sm:text-xl flex flex-col items-center justify-center gap-1 shadow-md transition-all active:scale-[0.98] touch-manipulation cursor-pointer ${
          isFull
            ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60"
            : "bg-teatro-blue hover:bg-teatro-blue-hover dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-900/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          <span>Entregar +1 Brazalete</span>
        </div>
        <span className="text-[11px] font-mono font-normal opacity-85">
          {isFull ? "Aforo completado (225/225)" : "1 toque por asistente"}
        </span>
      </button>

      {/* 2. Botones de Suma en Lote (+2, +3, +5, +10) */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-1">
          Sumar en cantidad (Grupos)
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 5, 10].map((qty) => (
            <button
              key={`add-${qty}`}
              type="button"
              disabled={isFull || metrics.availableRemaining < qty}
              onClick={() => handleTap(qty, `Grupo (+${qty})`)}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-teatro-blue dark:text-blue-400 font-mono font-bold text-sm sm:text-base transition-all active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{qty}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Botones de Resta en Lote (-1, -2, -3, -5, -10) */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-1">
          Restar en cantidad (Correcciones)
        </span>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[1, 2, 3, 5, 10].map((qty) => (
            <button
              key={`sub-${qty}`}
              type="button"
              disabled={metrics.deliveredCount < qty}
              onClick={() => handleTap(-qty, `Corrección (-${qty})`)}
              className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200/80 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 font-mono font-semibold text-xs sm:text-sm transition-all active:scale-95 touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-0.5"
              title={`Restar ${qty} brazaletes`}
            >
              <Minus className="w-3 h-3" />
              <span>{qty}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Control de Revertir Última Entrega y Reinicio */}
      <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          disabled={metrics.deliveredCount === 0}
          onClick={() => handleTap(-effectiveUndo, `Reversión última entrega (-${effectiveUndo})`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title={`Revertir el último registro (${effectiveUndo} brazalete${effectiveUndo > 1 ? "s" : ""})`}
        >
          <Undo2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Revertir última entrega (-{effectiveUndo})</span>
        </button>

        {showConfirmReset ? (
          <div className="flex items-center gap-1.5 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                onReset();
                setShowConfirmReset(false);
              }}
              className="px-2.5 py-1 bg-muni-red text-white text-[11px] font-bold rounded-lg cursor-pointer"
            >
              Confirmar 0
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-muni-red dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Poner en 0</span>
          </button>
        )}
      </div>

      {isFull && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-muni-red dark:text-red-300 font-medium">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>Capacidad máxima alcanzada ({metrics.totalCapacity}/{metrics.totalCapacity}).</span>
        </div>
      )}
    </div>
  );
};
