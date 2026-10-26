import React, { useState } from "react";
import { Sliders, Users, Armchair, Clock, CheckCircle2 } from "lucide-react";
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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 pb-28 space-y-3 text-slate-900 dark:text-slate-100 select-none">
      {/* 1. Barra de Control Operativo Directa (HUD de Acomodador) */}
      <header className="bg-white dark:bg-[#0b1a30] px-4 py-3 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En Sala
          </span>

          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="truncate max-w-[170px] sm:max-w-xs px-2.5 py-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>

          {/* Indicador de Brazalete Oficial (Default: Blanco) */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-[11px] font-medium text-slate-700 dark:text-slate-300 shrink-0"
            title={`Brazalete Oficial: ${currentEvent.braceletColorName || "Blanco Puro"}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
            />
            <span className="hidden sm:inline font-mono">
              {currentEvent.braceletColorName?.replace(" Oficial", "") || "Blanco"}
            </span>
          </div>
        </div>

        {/* Telemetría Compacta de Sala & Boletería */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold">
            <Users className="w-3 h-3 text-amber-500" />
            <span>{metrics.braceletsDelivered}</span>
            <span className="text-[10px] text-amber-600/70 font-normal">/{metrics.totalCapacity} ent.</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{metrics.seatedInRoom}</span>
            <span className="text-[10px] text-emerald-600/70 font-normal">sentados</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-mono font-semibold">
            <Clock className="w-3 h-3 text-rose-500" />
            <span>{metrics.inTransitOrNoShow}</span>
            <span className="text-[10px] text-rose-600/70 font-normal">faltan</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teatro-blue/10 text-teatro-blue dark:text-blue-300 text-xs font-mono font-bold">
            <Armchair className="w-3 h-3 text-teatro-blue dark:text-blue-400" />
            <span>{metrics.availableSeats}</span>
            <span className="text-[10px] text-teatro-blue/70 font-normal">libres</span>
          </div>

          {canManage && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Ajustar capacidad y color de brazalete"
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
