import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { TheaterEvent } from "../tickets/types";

interface HomeUpcomingEventsSectionProps {
  events: TheaterEvent[];
  onSelectEvent: (event: TheaterEvent) => void;
  onGoToCartelera: () => void;
}

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  events,
  onSelectEvent,
  onGoToCartelera,
}) => {
  if (!events || events.length === 0) return null;

  return (
    <section className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Próximas Funciones Oficiales
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cartelera activa de temporada • 4 eventos confirmados
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToCartelera}
          className="text-xs font-medium text-teatro-blue dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ver cartelera completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {events.map((evt) => {
          const isGeneral = evt.mode === "GENERAL_ADMISSION";
          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="group p-3.5 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border hover:border-teatro-blue/40 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="relative h-28 w-full rounded-xl overflow-hidden">
                  <img
                    src={evt.posterUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-white">
                    {evt.date}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                    {evt.genre}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teatro-blue dark:group-hover:text-blue-400 transition-colors mt-0.5">
                    {evt.title}
                  </h3>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-2xs">
                <span className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {evt.time} hrs
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-teatro-blue dark:text-blue-400">
                  <span
                    className="w-2 h-2 rounded-full ring-1 ring-slate-300 dark:ring-slate-700"
                    style={{ backgroundColor: evt.braceletColorHex || "#004ea2" }}
                    title={`Brazalete: ${evt.braceletColorName || "Oficial"}`}
                  />
                  <span>
                    {evt.ticketStyle === "HIBRIDO"
                      ? "Híbrido"
                      : isGeneral
                      ? "Brazalete"
                      : "Numerado"}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
