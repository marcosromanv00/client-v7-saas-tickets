import React, { useState } from "react";
import { Sliders, Armchair, CheckCircle2 } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { TheaterSeatMap } from "../seat-reservation/TheaterSeatMap";
import { EventConfigModal } from "../admin/EventConfigModal";
import { calculateAcomodadorRoomMetrics } from "./acomodadores-seat-handler";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
} from "../tickets/event-date-utils";

export const AcomodadoresLiveView: React.FC = () => {
  const store = useTheaterStore();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const currentEvent =
    store.events.find((e) => e.id === selectedEventId) ||
    upcomingEvents[0] ||
    findActiveEventForDate(store.events) ||
    store.events[0];

  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const deliveredBracelets = store.braceletCountersByEvent?.[currentEvent.id]?.deliveredCount || 0;
  const metrics = calculateAcomodadorRoomMetrics(currentEvent.totalCapacity, eventSeats, deliveredBracelets);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-1.5 sm:py-3 pb-20 sm:pb-24 space-y-2 text-slate-900 dark:text-slate-100 select-none overflow-x-hidden min-w-0">
      {/* 1. HUD Ribbon de Acomodador (Ultra-Minimalista Single-Screen) */}
      <header className="bg-white dark:bg-[#0b1a30] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-teatro-navy-border shadow-2xs flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-36 sm:w-56 truncate min-w-0 px-2 py-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 22 ? `${evt.title.slice(0, 20)}...` : evt.title} ({evt.time})
              </option>
            ))}
          </select>

          {/* Dot de Color Oficial del Brazalete */}
          <span
            className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
            style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
            title={`Brazalete Oficial: ${currentEvent.braceletColorName || "Blanco"}`}
          />
        </div>

        {/* Telemetría Clave en un Solo Renglón */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Armchair className="w-3 h-3" />
              {metrics.availableSeats} <span className="text-3xs font-normal opacity-75 font-sans">libres</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
              {metrics.seatedInRoom} <span className="text-3xs font-normal opacity-75 font-sans">en sala</span>
            </span>
          </div>

          {canManage && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1a3357] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              title="Ajustar capacidad y brazalete"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Mapa Directo de Sala para Acomodadores (Macro Bloques y Zoom Táctil) */}
      <TheaterSeatMap
        seats={eventSeats}
        selectedSeatIds={[]}
        onToggleSeat={(seat) => store.toggleSeatOccupancy(currentEvent.id, seat.id)}
        onFillRow={(rowLetter, fill) => store.fillRowOccupancy(currentEvent.id, rowLetter, fill)}
        allowVipSelection={true}
      />

      {/* Modal de Configuración */}
      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        braceletColors={store.braceletColors}
        onSave={(updated) => store.updateEvent(updated)}
      />
    </div>
  );
};
