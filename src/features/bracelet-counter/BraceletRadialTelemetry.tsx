import React from "react";
import { AlertCircle, Armchair } from "lucide-react";
import { BraceletMetrics } from "./bracelet-counter-types";
import { CircularProgressGauge } from "./CircularProgressGauge";

interface BraceletRadialTelemetryProps {
  metrics: BraceletMetrics;
}

export const BraceletRadialTelemetry: React.FC<BraceletRadialTelemetryProps> = ({
  metrics,
}) => {
  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  const availableColor = isFull
    ? "text-muni-red dark:text-red-400"
    : isWarning
    ? "text-amber-600 dark:text-amber-400"
    : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="w-full p-4 sm:p-5 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200/80 dark:border-[#142844] shadow-2xs flex flex-col items-center justify-center space-y-3.5 select-none transition-all">
      {/* 1. Medidor Radial Central */}
      <div className="py-1">
        <CircularProgressGauge metrics={metrics} size={152} />
      </div>

      {/* 2. Barra de Métricas Sutiles Inferiores (Disponibles vs Entregados) */}
      <div className="w-full pt-2.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800/80">
        {/* Lado Izquierdo: Disponibles */}
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-3xs font-mono uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
            Disponibles
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-xl sm:text-2xl font-bold font-mono leading-tight ${availableColor}`}>
              {metrics.availableRemaining}
            </span>
          </div>
          <span className="text-3xs font-sans text-slate-400 dark:text-slate-500 mt-0.5">
            butacas libres
          </span>
        </div>

        {/* Lado Derecho: Entregados */}
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-3xs font-mono uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
            Entregados
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 leading-tight">
              {metrics.deliveredCount}
            </span>
          </div>
          <span className="text-3xs font-sans text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
            <Armchair className="w-2.5 h-2.5 text-slate-400" />
            de {metrics.totalCapacity} total
          </span>
        </div>
      </div>

      {/* Banner de alerta discreto si el aforo está completo */}
      {isFull && (
        <div className="w-full flex items-center justify-center gap-1.5 py-1 px-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-2xs font-semibold text-muni-red dark:text-red-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Aforo completo alcanzado</span>
        </div>
      )}
    </div>
  );
};
