import React, { useState } from "react";
import { Sparkles, ShieldAlert, CheckCircle2, Palette, Sliders, Armchair } from "lucide-react";
import { TheaterEvent, BraceletColor } from "../tickets/types";
import { BraceletMetrics } from "./bracelet-counter-types";
import { BraceletColorPickerModal } from "./BraceletColorPickerModal";
import { EventConfigModal } from "../admin/EventConfigModal";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";

interface BraceletHeaderBannerProps {
  currentEvent: TheaterEvent;
  metrics: BraceletMetrics;
}

export const BraceletHeaderBanner: React.FC<BraceletHeaderBannerProps> = ({
  currentEvent,
  metrics,
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-teatro-blue dark:text-blue-400">
              {currentEvent.genre || "Función Oficial"} • {currentEvent.date}
            </span>

            {isFull ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muni-red text-white shadow-xs animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                SALA LLENA
              </span>
            ) : isWarning ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                ÚLTIMOS CUPOS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                ACCESO FLUIDO
              </span>
            )}
          </div>

          <h2 className="text-base sm:lg font-bold text-slate-900 dark:text-white leading-snug">
            {currentEvent.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Identificador interactivo del Brazalete Físico Autorizado */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] hover:border-teatro-blue/50 dark:hover:border-blue-500/50 shrink-0 cursor-pointer transition-all active:scale-[0.98]"
            title="Toca para cambiar el color oficial de brazalete"
          >
            <span
              className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#10b981" }}
            />
            <div className="text-left leading-tight">
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                Brazalete Oficial
                <Palette className="w-2.5 h-2.5 text-slate-400 group-hover:text-teatro-blue dark:group-hover:text-blue-400" />
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teatro-blue dark:group-hover:text-blue-400">
                {currentEvent.braceletColorName || "Verde Neón"}
              </span>
            </div>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs font-mono text-slate-600 dark:text-slate-300">
            <Armchair className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
            <span>{currentEvent.totalCapacity || 220} butacas</span>
          </div>

          {canManage && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teatro-blue hover:bg-teatro-blue-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Modificar color de brazalete y cantidad de butacas disponibles"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Modificar</span>
            </button>
          )}
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
