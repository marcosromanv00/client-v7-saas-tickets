import React, { useState } from "react";
import { Plus, Users, Undo2, RotateCcw, AlertOctagon } from "lucide-react";
import { BraceletMetrics } from "./bracelet-counter-types";

interface BraceletTactilePadProps {
  metrics: BraceletMetrics;
  onAddDelta: (delta: number, note?: string) => void;
  onReset: () => void;
}

export const BraceletTactilePad: React.FC<BraceletTactilePadProps> = ({
  metrics,
  onAddDelta,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isFull = metrics.status === "FULL";

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
    triggerHaptic(delta < 0 ? 50 : 35);
    onAddDelta(delta, label);
  };

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs space-y-4">
      {/* Botón Táctil Principal Gigante (+1 Brazalete) */}
      <button
        type="button"
        disabled={isFull}
        onClick={() => handleTap(1, "Ingreso individual")}
        className={`w-full py-8 sm:py-10 px-6 rounded-3xl font-extrabold text-white text-xl sm:text-2xl flex flex-col items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
          isFull
            ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none opacity-60"
            : "bg-teatro-blue hover:bg-teatro-blue-hover dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-900/20 hover:shadow-xl ring-4 ring-teatro-blue/10 dark:ring-blue-500/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          </div>
          <span className="tracking-tight">Entregar +1 Brazalete</span>
        </div>
        <span className="text-xs font-mono font-normal opacity-90">
          {isFull ? "Aforo completado - Sin cupos disponibles" : "Toque aquí por cada persona que ingresa"}
        </span>
      </button>

      {/* Botones de Lote Rápido para Grupos (+2, +3, +4, +5) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        <button
          type="button"
          disabled={isFull || metrics.availableRemaining < 2}
          onClick={() => handleTap(2, "Pareja (2)")}
          className="p-3 sm:p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-800 dark:text-slate-100 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1 text-sm sm:text-base font-extrabold text-teatro-blue dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            <span>+2</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Pareja</span>
        </button>

        <button
          type="button"
          disabled={isFull || metrics.availableRemaining < 3}
          onClick={() => handleTap(3, "Grupo de 3")}
          className="p-3 sm:p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-800 dark:text-slate-100 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1 text-sm sm:text-base font-extrabold text-teatro-blue dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            <span>+3</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Trío</span>
        </button>

        <button
          type="button"
          disabled={isFull || metrics.availableRemaining < 4}
          onClick={() => handleTap(4, "Familia (4)")}
          className="p-3 sm:p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-800 dark:text-slate-100 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1 text-sm sm:text-base font-extrabold text-teatro-blue dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            <span>+4</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Familia</span>
        </button>

        <button
          type="button"
          disabled={isFull || metrics.availableRemaining < 5}
          onClick={() => handleTap(5, "Grupo (5)")}
          className="p-3 sm:p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-800 dark:text-slate-100 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1 text-sm sm:text-base font-extrabold text-teatro-blue dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            <span>+5</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Grupo 5</span>
        </button>
      </div>

      {/* Botones de Control: Deshacer y Reiniciar */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-[#1a3357]">
        <button
          type="button"
          disabled={metrics.deliveredCount === 0}
          onClick={() => handleTap(-1, "Corrección por error")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Undo2 className="w-4 h-4 text-amber-500" />
          <span>Deshacer Último (-1)</span>
        </button>

        {showConfirmReset ? (
          <div className="flex items-center gap-2 animate-in fade-in">
            <span className="text-[11px] font-medium text-red-500">¿Reiniciar a 0?</span>
            <button
              type="button"
              onClick={() => {
                onReset();
                setShowConfirmReset(false);
              }}
              className="px-2.5 py-1.5 bg-muni-red text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Sí, poner en 0
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-muni-red dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar a 0</span>
          </button>
        )}
      </div>

      {isFull && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-muni-red dark:text-red-300 font-medium">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>Capacidad máxima alcanzada (220/220). No entregue más brazaletes.</span>
        </div>
      )}
    </div>
  );
};
