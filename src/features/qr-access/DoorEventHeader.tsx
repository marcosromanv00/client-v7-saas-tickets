import React, { useState } from "react";
import { Sliders, Armchair } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { useAuthStore } from "../auth/useAuthStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { EventConfigModal } from "../admin/EventConfigModal";

interface DoorEventHeaderProps {
  events: TheaterEvent[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  currentEvent: TheaterEvent;
}

export const DoorEventHeader: React.FC<DoorEventHeaderProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  currentEvent,
}) => {
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const store = useTheaterStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase text-teatro-blue dark:text-blue-400 tracking-widest font-semibold">
            Capa 2 • Acreditación y Puerta
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Control de Acceso y Lector QR
          </h1>
          {/* Badge Oficial del Brazalete y Butacas para este Evento */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div
              onClick={() => canManage && setIsConfigOpen(true)}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs ${
                canManage ? "cursor-pointer hover:border-teatro-blue/50 transition-colors" : ""
              }`}
              title={canManage ? "Toca para modificar color de brazalete o butacas" : undefined}
            >
              <span
                className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
                style={{ backgroundColor: currentEvent.braceletColorHex || "#004ea2" }}
              />
              <span className="text-slate-600 dark:text-slate-300">
                Brazalete Oficial:{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  {currentEvent.braceletColorName || "Azul Rey"}
                </strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <Armchair className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
              <span>{currentEvent.totalCapacity || 225} butacas</span>
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

        <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto max-w-full sm:max-w-xs">
          <label htmlFor="door-event-select" className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
            Función:
          </label>
          <select
            id="door-event-select"
            value={selectedEventId}
            onChange={(e) => onSelectEventId(e.target.value)}
            className="flex-1 min-w-0 w-full truncate text-ellipsis overflow-hidden px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teatro-blue cursor-pointer"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 32 ? `${evt.title.slice(0, 30)}...` : evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
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
