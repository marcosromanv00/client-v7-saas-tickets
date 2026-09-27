import React, { useState, useMemo } from "react";
import { Search, Armchair, Grid, Sliders } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { AcomodadorFeedItem } from "./AcomodadorFeedItem";
import { TheaterSeatMap } from "../seat-reservation/TheaterSeatMap";
import { EventConfigModal } from "../admin/EventConfigModal";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
  isGeneralAdmissionEvent,
} from "../tickets/event-date-utils";

export const AcomodadoresLiveView: React.FC = () => {
  const store = useTheaterStore();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [searchQuery, setSearchQuery] = useState("");
  const [showOccupancyMap, setShowOccupancyMap] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || upcomingEvents[0] || findActiveEventForDate(store.events) || store.events[0];
  const eventSeats = store.seatsByEvent[currentEvent.id] || [];

  const checkedInTickets = useMemo(() => {
    return store.tickets
      .filter((t) => t.eventId === currentEvent.id && t.checkedIn)
      .sort((a, b) => {
        const timeA = a.checkedInAt ? new Date(a.checkedInAt).getTime() : 0;
        const timeB = b.checkedInAt ? new Date(b.checkedInAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [store.tickets, currentEvent.id]);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return checkedInTickets;
    return checkedInTickets.filter(
      (t) =>
        t.citizenName.toLowerCase().includes(q) ||
        t.citizenId.toLowerCase().includes(q) ||
        (t.seatLabel && t.seatLabel.toLowerCase().includes(q))
    );
  }, [checkedInTickets, searchQuery]);

  const seatedCount = checkedInTickets.filter((t) => t.isSeated).length;
  const pendingCount = checkedInTickets.length - seatedCount;

  const handleToggleSeated = (ticketId: string) => {
    store.toggleTicketSeated(ticketId);
  };

  const isGeneralAdmission = isGeneralAdmissionEvent(currentEvent);
  const braceletCount = store.braceletCountersByEvent?.[currentEvent.id]?.deliveredCount || 0;
  const availableCount = Math.max(0, currentEvent.totalCapacity - braceletCount);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-28 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header Acomodadores */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sincronización en Sala Activa
            </span>
          </div>
          <h1 className="text-xl text-slate-900 dark:text-white font-bold tracking-tight mt-0.5">Control de Acomodadores en Sala</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Recepción y orientación de espectadores ingresando a sala.</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto min-w-0 max-w-full">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-xs truncate text-ellipsis overflow-hidden px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 32 ? `${evt.title.slice(0, 30)}...` : evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowOccupancyMap(!showOccupancyMap)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors shrink-0 ${
              showOccupancyMap
                ? "bg-teatro-blue text-white border-teatro-blue"
                : "bg-slate-100 dark:bg-[#071324] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#1a3357]"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{showOccupancyMap ? "Ver Feed" : "Mapa de Butacas"}</span>
          </button>
        </div>
      </div>

      {/* Banner de función con brazaletes y aforo disponible */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs">
        <div
          onClick={() => canManage && setIsConfigOpen(true)}
          className={`flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium ${canManage ? "cursor-pointer hover:opacity-80" : ""}`}
          title={canManage ? "Toca para modificar color de brazalete y butacas disponibles" : undefined}
        >
          <span className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0" style={{ backgroundColor: currentEvent.braceletColorHex || "#10b981" }} />
          <span>Brazalete Oficial: <strong>{currentEvent.braceletColorName || "Verde Neón"}</strong></span>
          {canManage && <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-1" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
            {braceletCount} / {currentEvent.totalCapacity} ({availableCount} libres)
          </span>
          {canManage && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold cursor-pointer shadow-xs hover:bg-emerald-700 transition-colors"
            >
              Modificar
            </button>
          )}
        </div>
      </div>

      {/* Métricas de sala compactadas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#0b1a30] p-3.5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{isGeneralAdmission ? "Brazaletes en Sala" : "Ingresaron a Sala"}</span>
          <p className="text-xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-0.5">{isGeneralAdmission ? braceletCount : checkedInTickets.length}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-3.5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{isGeneralAdmission ? "Disponibles" : "Ubicados en Asiento"}</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{isGeneralAdmission ? availableCount : seatedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-3.5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{isGeneralAdmission ? "Aforo Máximo" : "Por Ubicar"}</span>
          <p className="text-xl font-bold font-mono text-amber-500 dark:text-amber-400 mt-0.5">{isGeneralAdmission ? currentEvent.totalCapacity : pendingCount}</p>
        </div>
      </div>

      {showOccupancyMap ? (
        <div className="bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight">Mapa Visual de Ocupación en Sala</h2>
            <span className="text-xs text-slate-500">Toque una butaca para verificar su estado</span>
          </div>
          <TheaterSeatMap seats={eventSeats} selectedSeatIds={[]} onToggleSeat={() => {}} allowVipSelection />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Buscador de Asistentes */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar espectador por nombre, cédula o butaca (ej: Platea B-03)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teatro-blue shadow-xs"
            />
          </div>

          {/* Feed de ingresos */}
          <div className="space-y-2.5">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <AcomodadorFeedItem
                  key={t.id}
                  ticket={t}
                  onToggleSeated={handleToggleSeated}
                />
              ))
            ) : (
              <div className="p-6 text-center bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border space-y-1.5">
                <Armchair className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery ? "No se encontraron asistentes con ese criterio." : "Esperando los primeros ingresos desde puerta o taquilla..."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
