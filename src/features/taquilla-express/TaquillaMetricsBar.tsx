import React from "react";

interface TaquillaMetricsBarProps {
  capacity: {
    totalCapacity: number;
    preReservedCount: number;
    checkedInCount: number;
    availableRemaining: number;
    specialGuestsCount?: number;
  };
}

export const TaquillaMetricsBar: React.FC<TaquillaMetricsBarProps> = ({ capacity }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Aforo Máximo</span>
        <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{capacity.totalCapacity}</p>
        <span className="text-[10px] text-slate-400 font-mono block mt-1">
          {capacity.specialGuestsCount
            ? `${capacity.availableRemaining} público + ${capacity.specialGuestsCount} invitados`
            : "Brazaletes autorizados"}
        </span>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Invitados / Pre-reservas</span>
        <p className="text-2xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-1">{capacity.preReservedCount}</p>
        <span className="text-[10px] text-teatro-blue/80 dark:text-blue-400/80 font-mono block mt-1">
          {capacity.specialGuestsCount
            ? `${capacity.specialGuestsCount} reservados protocolo`
            : "Asignaciones previas"}
        </span>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">En Sala (Ingresados)</span>
        <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{capacity.checkedInCount}</p>
        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono block mt-1">
          Espectadores con brazalete
        </span>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Disponibles Público</span>
        <p className="text-2xl font-bold font-mono text-teatro-gold dark:text-amber-400 mt-1">{capacity.availableRemaining}</p>
        <span className="text-[10px] text-teatro-gold/80 dark:text-amber-400/80 font-mono block mt-1">
          Remanente para entrega
        </span>
      </div>
    </div>
  );
};
