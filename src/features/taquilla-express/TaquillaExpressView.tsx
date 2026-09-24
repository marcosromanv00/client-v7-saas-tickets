import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { CitizenSearchForm } from "./CitizenSearchForm";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { SearchResultCard } from "./SearchResultCard";
import { RecentEntriesList } from "./RecentEntriesList";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { findNextBestAvailableSeat } from "../tickets/hybrid-seating-utils";
import { Ticket, ZoneId } from "../tickets/types";

export function TaquillaExpressView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [searchedTicket, setSearchedTicket] = useState<Ticket | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);

  useEffect(() => {
    store.checkAndReleaseUnclaimed();
  }, [selectedEventId]);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const capacity = computeDynamicCapacity(currentEvent, store.tickets, store.specialGuests, eventSeats);

  const handleSearch = (idQuery: string) => {
    setSearchFeedback(null);
    const cleanQuery = idQuery.trim().toLowerCase();
    const found = store.tickets.find(
      (t) => t.eventId === currentEvent.id && t.citizenId.trim().toLowerCase() === cleanQuery
    );
    if (found) {
      setSearchedTicket(found);
    } else {
      setSearchedTicket(null);
      setSearchFeedback(`No se encontró reserva con cédula "${idQuery}".`);
    }
  };

  const handleCheckIn = (ticketId: string) => {
    const res = store.checkInTicket(ticketId);
    if (res.success && res.ticket) {
      setSearchedTicket(res.ticket);
    }
  };

  const handleQuickRegister = (data: { citizenName: string; citizenId: string; zone: ZoneId }) => {
    // Acomodo híbrido: asignar la siguiente mejor butaca disponible desde el frente hacia atrás
    const nextBestSeat = findNextBestAvailableSeat(eventSeats);

    const res = store.bookTicket({
      eventId: currentEvent.id,
      citizenName: data.citizenName,
      citizenId: data.citizenId,
      seatId: nextBestSeat ? nextBestSeat.id : null,
      zone: nextBestSeat ? nextBestSeat.zone : data.zone,
      notes: nextBestSeat ? `Acomodo híbrido frente (${nextBestSeat.label})` : "Walk-in emitido en Taquilla Express",
    });
    if (res.success && res.ticket) {
      store.checkInTicket(res.ticket.id);
      setSearchedTicket({ ...res.ticket, checkedIn: true, checkedInAt: new Date().toISOString() });
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const recentEntries = store.tickets
    .filter((t) => t.eventId === currentEvent.id && t.checkedIn)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 space-y-7 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Selector de Evento y Resumen Rápido */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase text-teatro-blue dark:text-blue-400 tracking-widest font-semibold">Capa 1 • Operación Presencial</span>
          <h1 className="text-xl text-slate-900 dark:text-white font-bold tracking-tight mt-0.5">Taquilla Express e Ingreso por Cédula</h1>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
              style={{ backgroundColor: currentEvent.braceletColorHex || "#004ea2" }}
            />
            <span className="text-slate-600 dark:text-slate-300">
              Brazalete Oficial: <strong className="text-slate-900 dark:text-white font-bold">{currentEvent.braceletColorName || "Azul Rey"}</strong>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="taquilla-event-select" className="text-xs font-mono text-slate-500 dark:text-slate-400">Función:</label>
          <select
            id="taquilla-event-select"
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSearchedTicket(null);
              setSearchFeedback(null);
            }}
            className="px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teatro-blue"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Métricas rápidas de aforo para el taquillero */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Aforo Máximo</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{capacity.totalCapacity}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Pre-reservas</span>
          <p className="text-2xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-1">{capacity.preReservedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">En Sala (Ingresados)</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{capacity.checkedInCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Remanente Walk-In</span>
          <p className="text-2xl font-bold font-mono text-teatro-gold dark:text-amber-400 mt-1">{capacity.availableRemaining}</p>
        </div>
      </div>

      {/* Buscador de Cédula */}
      <CitizenSearchForm
        onSearch={handleSearch}
        onOpenQuickRegister={() => setIsQuickRegisterOpen(true)}
      />

      {/* Tarjeta de Resultado de Búsqueda */}
      {searchedTicket && (
        <SearchResultCard
          ticket={searchedTicket}
          event={currentEvent}
          onCheckIn={handleCheckIn}
        />
      )}

      {searchFeedback && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{searchFeedback}</span>
          </div>
          <button
            onClick={() => setIsQuickRegisterOpen(true)}
            className="px-3.5 py-1.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Emitir como Walk-In
          </button>
        </div>
      )}

      {/* Entradas recientes en puerta */}
      <RecentEntriesList entries={recentEntries} />

      <QuickRegisterModal
        isOpen={isQuickRegisterOpen}
        onClose={() => setIsQuickRegisterOpen(false)}
        event={currentEvent}
        onRegister={handleQuickRegister}
      />
    </div>
  );
}
