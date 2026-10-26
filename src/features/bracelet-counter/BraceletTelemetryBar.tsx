import React, { useState } from "react";
import { Sliders, Armchair, History, Palette } from "lucide-react";
import { TheaterEvent, BraceletColor } from "../tickets/types";
import { BraceletMetrics } from "./bracelet-counter-types";
import { BraceletColorPickerModal } from "./BraceletColorPickerModal";
import { EventConfigModal } from "../admin/EventConfigModal";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";

interface BraceletTelemetryBarProps {
  currentEvent: TheaterEvent;
  metrics: BraceletMetrics;
  historyCount: number;
  onOpenHistory: () => void;
}

export const BraceletTelemetryBar: React.FC<BraceletTelemetryBarProps> = ({
  currentEvent,
  metrics,
  historyCount,
  onOpenHistory,
}) => {
  const store = useTheaterStore();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;

  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  const handleSaveColor = (color: BraceletColor) => {
    store.setEventBraceletColor(currentEvent.id, color);
  };

  const barColor = isFull
    ? "bg-muni-red"
    : isWarning
    ? "bg-amber-500"
    : "bg-emerald-500";

  return (
    <>
      <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-2xs space-y-2">
        {/* Fila 1: Metadatos Compactos y Controles Rápidos */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Identificador del Brazalete Físico (Pill Interactivo) */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="group flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] hover:border-teatro-blue/50 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shrink-0"
            title="Toca para cambiar el color oficial de brazalete"
          >
            <span
              className="w-3.5 h-3.5 rounded-full ring-1 ring-white dark:ring-slate-900 shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#10b981" }}
            />
            <span className="truncate max-w-[85px] sm:max-w-none text-2xs uppercase tracking-wider font-mono">
              {currentEvent.braceletColorName || "Brazalete"}
            </span>
            <Palette className="w-3 h-3 text-slate-400 group-hover:text-teatro-blue" />
          </button>

          {/* Aforo Total */}
          <div className="flex items-center gap-1 text-2xs font-mono text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg bg-slate-50 dark:bg-[#071324] border border-slate-200/60 dark:border-slate-800 shrink-0">
            <Armchair className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
            <span>{metrics.totalCapacity} butacas</span>
          </div>

          {/* Acciones Rápidas: Modificar e Historial */}
          <div className="flex items-center gap-1 shrink-0">
            {canManage && (
              <button
                type="button"
                onClick={() => setIsConfigOpen(true)}
                className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-2xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Modificar aforo y brazalete"
              >
                <Sliders className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
                <span className="hidden sm:inline">Ajustes</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHistory}
              className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-2xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Ver registro de entregas"
            >
              <History className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
              <span className="font-mono text-2xs">{historyCount}</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Telemetría de Alto Impacto (Entregados vs Disponibles) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-baseline justify-between px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-[#142844]">
            <span className="text-2xs font-mono uppercase font-medium text-slate-500 dark:text-slate-400">
              Entregados
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
                {metrics.deliveredCount}
              </span>
              <span className="text-3xs font-mono text-slate-400">
                ({metrics.percentageOccupied}%)
              </span>
            </div>
          </div>

          <div
            className={`flex items-baseline justify-between px-2.5 py-1.5 rounded-xl border transition-colors ${
              isFull
                ? "bg-rose-500/10 border-rose-500/30 text-muni-red"
                : isWarning
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            <span className="text-2xs font-mono uppercase font-bold">
              Disponibles
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black font-mono">
                {metrics.availableRemaining}
              </span>
              <span className="text-3xs font-mono opacity-80">libres</span>
            </div>
          </div>
        </div>

        {/* Barra de Progreso Minimalista (3px) */}
        <div className="w-full h-1 bg-slate-100 dark:bg-[#071324] rounded-full overflow-hidden border border-slate-200/50 dark:border-[#1a3357]">
          <div
            className={`h-full transition-all duration-300 ease-out ${barColor}`}
            style={{ width: `${metrics.percentageOccupied}%` }}
          />
        </div>
      </div>

      <BraceletColorPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentColorHex={currentEvent.braceletColorHex}
        currentColorName={currentEvent.braceletColorName}
        availableColors={store.braceletColors}
        onSaveColor={handleSaveColor}
      />

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        braceletColors={store.braceletColors}
        onSave={(updated) => store.updateEvent(updated)}
      />
    </>
  );
};
