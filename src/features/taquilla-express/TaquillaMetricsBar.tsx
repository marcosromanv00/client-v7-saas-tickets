import React from "react";

interface TaquillaMetricsBarProps {
  capacity: {
    totalCapacity: number;
    preReservedCount: number;
    checkedInCount: number;
    availableRemaining: number;
  };
}

export const TaquillaMetricsBar: React.FC<TaquillaMetricsBarProps> = ({ capacity }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Aforo Máximo</span>
        <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{capacity.totalCapacity}</p>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Pre-reservas</span>
        <p className="text-2xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-1">{capacity.preReservedCount}</p>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">En Sala (Ingresados)</span>
        <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{capacity.checkedInCount}</p>
      </div>
      <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Remanente Walk-In</span>
        <p className="text-2xl font-bold font-mono text-teatro-gold dark:text-amber-400 mt-1">{capacity.availableRemaining}</p>
      </div>
    </div>
  );
};
