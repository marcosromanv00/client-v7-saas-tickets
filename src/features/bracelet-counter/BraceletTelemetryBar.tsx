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
        <div className="flex items-center justify-between gap-2">
          {/* Identificador del Brazalete Físico */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] hover:border-teatro-blue/50 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shrink-0"
            title="Toca para cambiar el color oficial de brazalete"
          >
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xs shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#10b981" }}
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {currentEvent.braceletColorName || "Brazalete"}
            </span>
            <Palette className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Aforo Total */}
            <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg bg-slate-50 dark:bg-[#071324] border border-slate-200/70 dark:border-slate-800">
              <Armchair className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
              <span>{metrics.totalCapacity} butacas</span>
            </div>

            {/* Acciones Rápidas */}
            {canManage && (
              <button
                type="button"
                onClick={() => setIsConfigOpen(true)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
                title="Ajustar aforo y función"
              >
                <Sliders className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#071324] dark:hover:bg-[#10243f] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              title="Ver registro de entregas"
            >
              <History className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
              <span className="font-mono text-2xs">{historyCount}</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Telemetría de Alto Impacto (Entregados vs Disponibles) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-[#142844]">
            <span className="text-2xs font-mono uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              Entregados
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white leading-none">
                {metrics.deliveredCount}
              </span>
              <span className="text-2xs font-mono text-slate-400">
                ({metrics.percentageOccupied}%)
              </span>
            </div>
            <span className="text-3xs text-slate-400 font-mono mt-0.5">
              en sala
            </span>
          </div>

          <div
            className={`flex flex-col p-2.5 rounded-xl border transition-colors ${
              isFull
                ? "bg-rose-500/10 border-rose-500/30 text-muni-red"
                : isWarning
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            <span className="text-2xs font-mono uppercase font-bold tracking-wider">
              Disponibles
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-mono leading-none">
                {metrics.availableRemaining}
              </span>
            </div>
            <span className="text-3xs font-mono opacity-80 mt-0.5">
              butacas libres
            </span>
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
