import React from "react";
import { Ticket as TicketIcon, Search, Sliders, History, Palette } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { useAuthStore } from "../auth/useAuthStore";

interface TaquillaHeaderPanelProps {
  currentEvent: TheaterEvent;
  upcomingEvents: TheaterEvent[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  activeSubView: "brazaletes" | "cortesias";
  onSelectSubView: (view: "brazaletes" | "cortesias") => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenConfig: () => void;
  onOpenColorPicker: () => void;
}

export const TaquillaHeaderPanel: React.FC<TaquillaHeaderPanelProps> = ({
  currentEvent,
  upcomingEvents,
  selectedEventId,
  onSelectEventId,
  activeSubView,
  onSelectSubView,
  historyCount,
  onOpenHistory,
  onOpenConfig,
  onOpenColorPicker,
}) => {
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;

  return (
    <div className="w-full p-3 sm:p-4 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200/80 dark:border-[#142844] shadow-2xs space-y-2.5 select-none transition-all">
      {/* Fila 1: Selector de Función Principal y Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full min-w-0">
        {/* Selector de Evento */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-3xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold shrink-0">
            Función:
          </span>
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEventId(e.target.value)}
            className="w-full sm:max-w-xs truncate min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none hover:border-teatro-blue/40 transition-colors"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 26 ? `${evt.title.slice(0, 24)}...` : evt.title} ({evt.time})
              </option>
            ))}
          </select>
        </div>

        {/* Acciones Rápidas de Utilidad (Color, Ajustes, Historial) */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {/* Píldora de Color Oficial del Brazalete */}
          <button
            type="button"
            onClick={onOpenColorPicker}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] hover:border-teatro-blue/50 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shrink-0"
            title="Cambiar color oficial del brazalete"
          >
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xs shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
            />
            <span className="text-2xs font-semibold text-slate-700 dark:text-slate-300 hidden xs:inline">
              {currentEvent.braceletColorName || "Brazalete"}
            </span>
            <Palette className="w-3 h-3 text-slate-400" />
          </button>

          {/* Ajustes de Aforo */}
          {canManage && (
            <button
              type="button"
              onClick={onOpenConfig}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
              title="Ajustar aforo y función"
            >
              <Sliders className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
            </button>
          )}

          {/* Auditoría / Historial */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            title="Ver auditoría de entregas"
          >
            <History className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
            <span className="font-mono text-2xs font-bold">{historyCount}</span>
          </button>
        </div>
      </div>

      {/* Fila 2: Conmutador Sutil de Sub-vista (Brazaletes vs Cortesías) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
        <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100 dark:bg-[#071324] border border-slate-200/80 dark:border-[#1a3357] w-full sm:w-72 shrink-0">
          <button
            type="button"
            onClick={() => onSelectSubView("brazaletes")}
            className={`flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === "brazaletes"
                ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TicketIcon className="w-3.5 h-3.5" />
            <span>Brazaletes</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSubView("cortesias")}
            className={`flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === "cortesias"
                ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cortesías</span>
          </button>
        </div>
      </div>
    </div>
  );
};
