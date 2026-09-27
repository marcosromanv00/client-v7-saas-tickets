import React, { useState } from "react";
import { Sliders, Armchair, Grid } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { useAuthStore } from "../auth/useAuthStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { EventConfigModal } from "../admin/EventConfigModal";

interface TaquillaExpressHeaderProps {
  currentEvent: TheaterEvent;
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  upcomingEvents: TheaterEvent[];
  isGeneralAdmission: boolean;
  deliveredCount: number;
  onOpenGroupModal?: () => void;
  onOpenDeskQr?: () => void;
  showMatrix?: boolean;
  onToggleMatrix?: () => void;
}

export const TaquillaExpressHeader: React.FC<TaquillaExpressHeaderProps> = ({
  currentEvent,
  selectedEventId,
  onSelectEventId,
  upcomingEvents,
  isGeneralAdmission,
  deliveredCount,
  onOpenGroupModal,
  onOpenDeskQr,
  showMatrix,
  onToggleMatrix,
}) => {
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const store = useTheaterStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase text-teatro-blue dark:text-blue-400 tracking-widest font-semibold">
            Mesa 1 • Registro & Walk-In
          </span>
          <h1 className="text-xl text-slate-900 dark:text-white font-bold tracking-tight mt-0.5">
            Taquilla Presencial y Asignación de Butacas
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div
              onClick={() => canManage && setIsConfigOpen(true)}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs ${
                canManage ? "cursor-pointer hover:border-teatro-blue/50 transition-colors" : ""
              }`}
              title={canManage ? "Toca para modificar color de brazalete o butacas" : undefined}
            >
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
                style={{ backgroundColor: currentEvent.braceletColorHex || "#004ea2" }}
              />
              <span className="text-slate-600 dark:text-slate-300">
                Brazalete:{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  {currentEvent.braceletColorName || "Azul Rey"}
                </strong>
                {isGeneralAdmission && (
                  <span className="ml-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    • {deliveredCount} entregados
                  </span>
                )}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <Armchair className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
              <span>{currentEvent.totalCapacity || 220} butacas</span>
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => setIsConfigOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teatro-blue/10 text-teatro-blue dark:text-blue-400 hover:bg-teatro-blue/20 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Modificar color de brazalete y butacas disponibles"
              >
                <Sliders className="w-3 h-3" />
                <span>Modificar</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEventId(e.target.value)}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-xs truncate text-ellipsis overflow-hidden px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 32 ? `${evt.title.slice(0, 30)}...` : evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
          {onOpenGroupModal && (
            <button
              type="button"
              onClick={onOpenGroupModal}
              className="px-3.5 py-2 bg-teatro-blue hover:bg-teatro-blue-hover text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>Sugerir Grupo</span>
            </button>
          )}
          {onOpenDeskQr && (
            <button
              type="button"
              onClick={onOpenDeskQr}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-[#1a3357] transition-colors"
            >
              <span>QR Mesa</span>
            </button>
          )}
          {onToggleMatrix && (
            <button
              type="button"
              onClick={onToggleMatrix}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                showMatrix
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300"
                  : "bg-slate-100 dark:bg-[#071324] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#1a3357]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showMatrix ? "Ocultar Matriz" : "Ver Matriz"}</span>
            </button>
          )}
        </div>
      </div>

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
