import React from "react";
import { Users, Armchair, Ticket } from "lucide-react";
import { BraceletMetrics } from "./bracelet-counter-types";

interface BraceletMetricsCardProps {
  metrics: BraceletMetrics;
}

export const BraceletMetricsCard: React.FC<BraceletMetricsCardProps> = ({ metrics }) => {
  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  const barColor = isFull
    ? "bg-muni-red"
    : isWarning
    ? "bg-amber-500"
    : "bg-emerald-500";

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs space-y-5">
      {/* Cifras de Impacto Rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Entregados */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-left">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-mono uppercase font-medium">Brazaletes Entregados</span>
            <Ticket className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
          </div>
          <p className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            {metrics.deliveredCount}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">espectadores en sala</span>
        </div>

        {/* Disponibles */}
        <div
          className={`p-4 rounded-2xl border text-left transition-colors ${
            isFull
              ? "bg-red-500/10 border-red-500/30 text-muni-red"
              : isWarning
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          <div className="flex items-center justify-between opacity-80">
            <span className="text-[11px] font-mono uppercase font-bold">Espacios Disponibles</span>
            <Armchair className="w-4 h-4" />
          </div>
          <p className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
            {metrics.availableRemaining}
          </p>
          <span className="text-[10px] font-mono opacity-80">butacas libres</span>
        </div>

        {/* Capacidad Máxima */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-left">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-mono uppercase font-medium">Aforo Autorizado</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-slate-700 dark:text-slate-300 tracking-tight">
            {metrics.totalCapacity}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">asientos oficiales</span>
        </div>
      </div>

      {/* Barra de Aforo Dinámica */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Ocupación actual: <strong className="text-slate-900 dark:text-white font-bold">{metrics.percentageOccupied}%</strong>
          </span>
          <span
            className={`font-semibold ${
              isFull ? "text-muni-red" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {metrics.statusLabel}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-[#071324] rounded-full overflow-hidden border border-slate-200 dark:border-[#1a3357] p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${barColor}`}
            style={{ width: `${metrics.percentageOccupied}%` }}
          />
        </div>
      </div>
    </div>
  );
};
