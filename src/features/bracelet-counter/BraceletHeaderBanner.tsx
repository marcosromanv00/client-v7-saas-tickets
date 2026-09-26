import React from "react";
import { Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { BraceletMetrics } from "./bracelet-counter-types";

interface BraceletHeaderBannerProps {
  currentEvent: TheaterEvent;
  metrics: BraceletMetrics;
}

export const BraceletHeaderBanner: React.FC<BraceletHeaderBannerProps> = ({
  currentEvent,
  metrics,
}) => {
  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-teatro-blue dark:text-blue-400">
            Función Sábado 26 • Orden de Llegada
          </span>

          {isFull ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muni-red text-white shadow-xs animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              SALA LLENA
            </span>
          ) : isWarning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              ÚLTIMOS CUPOS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              ACCESO FLUIDO
            </span>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentEvent.title}
        </h2>
      </div>

      {/* Identificador del Brazalete Físico Autorizado */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] shrink-0">
        <span
          className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs shrink-0"
          style={{ backgroundColor: currentEvent.braceletColorHex || "#10b981" }}
        />
        <div className="text-left leading-tight">
          <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
            Brazalete Oficial
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {currentEvent.braceletColorName || "Verde Neón"}
          </span>
        </div>
      </div>
    </div>
  );
};
