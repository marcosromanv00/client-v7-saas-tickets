import React from "react";
import { TheaterEvent } from "../tickets/types";

interface SeasonShowcaseGridProps {
  events: TheaterEvent[];
  selectedEvent: TheaterEvent;
  onSelectEvent: (event: TheaterEvent) => void;
}

export const SeasonShowcaseGrid: React.FC<SeasonShowcaseGridProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cartelera Oficial del Teatro ({events.length} Obras y Conciertos)
        </h2>
        <span className="text-xs text-teatro-gold dark:text-amber-400 font-mono">Temporada 2026</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-115 overflow-y-auto pr-1">
        {events.map((evt) => {
          const isCurrent = evt.id === selectedEvent.id;
          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                isCurrent
                  ? "bg-teatro-blue-light dark:bg-teatro-blue/20 border-teatro-blue dark:border-blue-500/40 shadow-xs"
                  : "bg-white dark:bg-[#0b1a30] border-slate-200 dark:border-teatro-navy-border hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <img
                src={evt.posterUrl}
                alt={evt.title}
                className="w-14 h-18 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teatro-blue dark:group-hover:text-blue-400 transition-colors truncate">
                  {evt.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{evt.genre}</p>
                <p className="text-[10px] text-teatro-blue dark:text-blue-400 font-mono">
                  {evt.isPrivate ? "🔒 Gala Privada" : "220 butacas libres"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
