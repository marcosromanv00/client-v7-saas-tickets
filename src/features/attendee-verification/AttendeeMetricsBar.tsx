import React from "react";
import { Users, CheckCircle2, Clock, Crown } from "lucide-react";
import { AttendeeMetrics } from "./attendee-types";

interface AttendeeMetricsBarProps {
  metrics: AttendeeMetrics;
  totalCapacity: number;
}

export const AttendeeMetricsBar: React.FC<AttendeeMetricsBarProps> = ({
  metrics,
  totalCapacity,
}) => {
  return (
    <div className="bg-white/80 dark:bg-[#0c1a2f]/80 backdrop-blur-xs rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-3 shadow-xs transition-colors">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Total Esperados */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-400/15 flex items-center justify-center text-teatro-blue dark:text-blue-400 shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block leading-none truncate">
              Convocados
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-100">
                {metrics.totalExpected}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                / {totalCapacity} cap.
              </span>
            </div>
          </div>
        </div>

        {/* Ingresados en Sala */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block leading-none truncate">
              En Sala
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-semibold font-mono text-emerald-700 dark:text-emerald-300">
                {metrics.checkedInCount}
              </span>
              <span className="text-[10px] font-semibold font-mono px-1.5 py-0.2 rounded-md bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                {metrics.attendancePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Pendientes de Ingreso */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block leading-none truncate">
              Por Ingresar
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-100">
                {metrics.pendingCount}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">en espera</span>
            </div>
          </div>
        </div>

        {/* Protocolo / Honor */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 dark:bg-purple-400/15 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block leading-none truncate">
              Protocolo / VIP
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-100">
                {metrics.vipCount}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">asignados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
