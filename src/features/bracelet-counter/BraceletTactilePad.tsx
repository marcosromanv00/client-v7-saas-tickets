import React, { useState } from "react";
import { Plus, Minus, Undo2, Redo2, RotateCcw } from "lucide-react";
import { BraceletMetrics } from "./bracelet-counter-types";
import { useBraceletHistoryState } from "./useBraceletHistoryState";

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
  const [padMode, setPadMode] = useState<"add" | "sub">("add");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isFull = metrics.status === "FULL";

  const { registerAction, undo, redo, clearHistory, canUndo, canRedo, lastUndoVal, lastRedoVal } =
    useBraceletHistoryState(metrics.deliveredCount, lastDeliveryDelta, onAddDelta);

  const triggerHaptic = (ms: number = 25) => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const handleTap = (delta: number, label: string) => {
    triggerHaptic(delta < 0 ? 35 : 20);
    onAddDelta(delta, label);
    registerAction(delta);
  };

  return (
    <div className="w-full p-3 sm:p-4 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200/80 dark:border-[#142844] shadow-2xs space-y-3 select-none">
      {/* 1. Conmutador de Modo Limpio (Entregar vs Corregir) */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-[#071324] border border-slate-200/80 dark:border-[#1a3357]">
        <button
          type="button"
          onClick={() => {
            setPadMode("add");
            setShowConfirmReset(false);
          }}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            padMode === "add"
              ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Entregar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPadMode("sub");
            setShowConfirmReset(false);
          }}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            padMode === "sub"
              ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-2xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Corregir</span>
        </button>
      </div>

      {padMode === "add" ? (
        /* MODO 1: ENTREGA DE BRAZALETES */
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <button
            type="button"
            disabled={isFull}
            onClick={() => handleTap(1, "Ingreso (+1)")}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] touch-manipulation cursor-pointer ${
              isFull
                ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60"
                : "bg-teatro-blue hover:bg-teatro-blue-hover dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-900/15"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Entregar 1 brazalete</span>
          </button>

          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 5, 10].map((qty) => (
              <button
                key={`add-${qty}`}
                type="button"
                disabled={isFull || metrics.availableRemaining < qty}
                onClick={() => handleTap(qty, `Grupo (+${qty})`)}
                className="py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200/80 dark:border-[#1a3357] text-teatro-blue dark:text-blue-400 font-mono font-bold text-sm transition-all active:scale-95 touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-0.5 shadow-2xs"
              >
                <span>+{qty}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* MODO 2: CORRECCIÓN Y DEDUCCIÓN */
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <button
            type="button"
            disabled={metrics.deliveredCount < 1}
            onClick={() => handleTap(-1, "Corrección (-1)")}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.98] touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
            <span>Restar 1 brazalete</span>
          </button>

          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 5, 10].map((qty) => (
              <button
                key={`sub-${qty}`}
                type="button"
                disabled={metrics.deliveredCount < qty}
                onClick={() => handleTap(-qty, `Corrección (-${qty})`)}
                className="py-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-200/60 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 font-mono font-semibold text-sm transition-all active:scale-95 touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-0.5 shadow-2xs"
              >
                <span>-{qty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Barra de Deshacer, Rehacer y Restablecer */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200/80 dark:border-[#1a3357] text-2xs font-medium text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Deshacer última acción"
          >
            <Undo2 className="w-3 h-3 text-slate-500" />
            <span>Deshacer{lastUndoVal && lastUndoVal > 0 ? ` (${lastUndoVal > 0 ? `-${lastUndoVal}` : `+${Math.abs(lastUndoVal)}`})` : ""}</span>
          </button>

          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200/80 dark:border-[#1a3357] text-2xs font-medium text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Rehacer acción deshecha"
          >
            <Redo2 className="w-3 h-3 text-slate-500" />
            <span>Rehacer{lastRedoVal ? ` (${lastRedoVal > 0 ? `+${lastRedoVal}` : lastRedoVal})` : ""}</span>
          </button>
        </div>

        {showConfirmReset ? (
          <div className="flex items-center gap-1.5 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                onReset();
                clearHistory();
                setShowConfirmReset(false);
              }}
              className="px-2 py-0.5 bg-muni-red text-white text-3xs font-semibold rounded cursor-pointer"
            >
              Confirmar 0
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-1.5 py-0.5 text-slate-400 hover:text-slate-600 text-3xs cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={metrics.deliveredCount === 0}
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 px-2 py-1 text-2xs font-medium text-slate-400 hover:text-muni-red dark:hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Poner en 0</span>
          </button>
        )}
      </div>
    </div>
  );
};
