import React from "react";

export const TheaterSeatMapLegend: React.FC = () => {
  return (
    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-3xs font-mono text-slate-500 dark:text-slate-400 select-none">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs clay-seat-available" />
        <span>Libre</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs clay-seat-selected" />
        <span className="font-semibold text-teatro-blue dark:text-blue-400">Seleccionada</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs clay-seat-occupied" />
        <span>Ocupada</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs clay-seat-vip" />
        <span className="text-amber-600 dark:text-amber-400">VIP</span>
      </div>
      <div className="flex items-center gap-0.5">
        <span className="text-2xs leading-none">♿</span>
        <span>7600</span>
      </div>
    </div>
  );
};
