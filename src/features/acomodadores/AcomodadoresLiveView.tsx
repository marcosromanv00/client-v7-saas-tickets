import React, { useState, useMemo } from "react";
import { Search, Armchair, Grid } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { AcomodadorFeedItem } from "./AcomodadorFeedItem";
import { TheaterSeatMap } from "../seat-reservation/TheaterSeatMap";

export const AcomodadoresLiveView: React.FC = () => {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOccupancyMap, setShowOccupancyMap] = useState(false);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
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

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowOccupancyMap(!showOccupancyMap)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
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

      {/* Métricas de sala */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#0b1a30] p-4 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Ingresaron a Sala</span>
          <p className="text-xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-0.5">{checkedInTickets.length}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-4 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Ubicados en Asiento</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{seatedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-4 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Por Ubicar</span>
          <p className="text-xl font-bold font-mono text-amber-500 dark:text-amber-400 mt-0.5">{pendingCount}</p>
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
              <div className="p-8 text-center bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border space-y-2">
                <Armchair className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery ? "No se encontraron asistentes con ese criterio." : "Esperando los primeros ingresos desde puerta o taquilla..."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
