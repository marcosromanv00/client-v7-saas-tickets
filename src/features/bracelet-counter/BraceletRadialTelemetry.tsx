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
    <div className="w-full p-4 sm:p-5 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200/80 dark:border-[#142844] shadow-2xs flex flex-col items-center justify-center space-y-2 select-none transition-all">
      {/* 1. Medidor de Tacómetro Radial de 220° */}
      <div className="pt-1 pb-0">
        <CircularProgressGauge metrics={metrics} size={160} />
      </div>

      {/* 2. Pods Sutiles de Métricas (Disponibles vs Entregados) */}
      <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
        {/* Pod Izquierdo: Disponibles */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#071324]/70 border border-slate-200/60 dark:border-slate-800/60 transition-colors">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isFull ? "bg-muni-red" : isWarning ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            <span className="text-2xs font-sans font-medium text-slate-500 dark:text-slate-400">
              Disponibles
            </span>
          </div>
          <span className={`text-2xl font-bold font-mono leading-tight mt-1 ${availableColor}`}>
            {metrics.availableRemaining}
          </span>
          <span className="text-3xs font-sans text-slate-400 dark:text-slate-500 mt-0.5">
            butacas libres
          </span>
        </div>

        {/* Pod Derecho: Entregados */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#071324]/70 border border-slate-200/60 dark:border-slate-800/60 transition-colors">
          <div className="flex items-center gap-1.5">
            <Armchair className="w-3 h-3 text-slate-400" />
            <span className="text-2xs font-sans font-medium text-slate-500 dark:text-slate-400">
              Entregados
            </span>
          </div>
          <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 leading-tight mt-1">
            {metrics.deliveredCount}
          </span>
          <span className="text-3xs font-sans text-slate-400 dark:text-slate-500 mt-0.5">
            de {metrics.totalCapacity} capacidad
          </span>
        </div>
      </div>

      {/* Alerta si el aforo está completo */}
      {isFull && (
        <div className="w-full flex items-center justify-center gap-1.5 py-1 px-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-2xs font-semibold text-muni-red dark:text-red-300 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Aforo completo alcanzado</span>
        </div>
      )}
    </div>
  );
};
