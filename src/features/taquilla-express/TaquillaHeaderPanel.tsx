import React, { useState, useRef, useEffect } from "react";
import { Ticket as TicketIcon, Search, MoreVertical, Sliders, History, Palette } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="w-full p-3 sm:p-3.5 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200/80 dark:border-[#142844] shadow-2xs space-y-2.5 select-none transition-all">
      {/* Fila 1: Selector de Función */}
      <div className="flex items-center gap-2 w-full min-w-0">
        <span className="text-2xs font-mono font-medium text-slate-400 dark:text-slate-500 shrink-0">
          Función:
        </span>
        <select
          value={selectedEventId}
          onChange={(e) => onSelectEventId(e.target.value)}
          className="flex-1 truncate min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200/80 dark:border-[#1a3357] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer outline-none hover:border-teatro-blue/40 transition-colors"
        >
          {upcomingEvents.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title.length > 28 ? `${evt.title.slice(0, 26)}...` : evt.title} ({evt.time})
            </option>
          ))}
        </select>
      </div>

      {/* Fila 2: Sub-vistas y Menú Unificado de Opciones en una Sola Línea */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 w-full min-w-0">
        {/* Pestañas de Modo (Brazaletes / Cortesías) */}
        <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100 dark:bg-[#071324] border border-slate-200/80 dark:border-[#1a3357] w-52 sm:w-60 shrink-0">
          <button
            type="button"
            onClick={() => onSelectSubView("brazaletes")}
            className={`flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubView === "cortesias"
                ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cortesías</span>
          </button>
        </div>

        {/* Menú Único de Opciones y Utilidades */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200/80 dark:border-[#1a3357] text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-colors"
            title="Opciones de función y auditoría"
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
            />
            <span className="hidden sm:inline">Opciones</span>
            <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Menú Desplegable Agrupado */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-white dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] shadow-xl p-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 space-y-0.5">
              {/* Opción 1: Color de Brazalete */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenColorPicker();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Color de brazalete</span>
                </div>
                <span
                  className="w-3 h-3 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shrink-0 ml-1.5"
                  style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
                />
              </button>

              {/* Opción 2: Ajustes de Aforo */}
              {canManage && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenConfig();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Ajustar aforo</span>
                  </div>
                  <span className="text-3xs font-mono text-slate-400">
                    {currentEvent.totalCapacity}
                  </span>
                </button>
              )}

              {/* Opción 3: Historial de Entregas */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Historial de entregas</span>
                </div>
                <span className="font-mono text-3xs font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {historyCount}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
