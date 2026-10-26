import React from "react";

export const TheaterSeatMapLegend: React.FC = () => {
  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-teatro-navy-border flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-700 dark:text-slate-200">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-xs clay-seat-available" />
        <span className="text-[10px] text-slate-500 dark:text-slate-400">Disponible</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-xs clay-seat-selected" />
        <span className="text-[10px] font-semibold text-teatro-blue dark:text-blue-400">Seleccionada</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-xs clay-seat-occupied" />
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Ocupada</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-xs clay-seat-vip" />
        <span className="text-[10px] text-teatro-gold dark:text-amber-400 font-semibold">Protocolo VIP</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">♿</span>
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Accesible Ley 7600</span>
      </div>
    </div>
  );
};
