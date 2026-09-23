import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { CitizenSearchForm } from "./CitizenSearchForm";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { SearchResultCard } from "./SearchResultCard";
import { RecentEntriesList } from "./RecentEntriesList";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { Ticket, ZoneId } from "../tickets/types";

export function TaquillaExpressView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [searchedTicket, setSearchedTicket] = useState<Ticket | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);

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
      setSearchFeedback(`No se encontró reserva previa con cédula "${idQuery}".`);
    }
  };

  const handleCheckIn = (ticketId: string) => {
    const res = store.checkInTicket(ticketId);
    if (res.success && res.ticket) {
      setSearchedTicket(res.ticket);
    }
  };

  const handleQuickRegister = (data: { citizenName: string; citizenId: string; zone: ZoneId }) => {
    const res = store.bookTicket({
      eventId: currentEvent.id,
      citizenName: data.citizenName,
      citizenId: data.citizenId,
      seatId: null,
      zone: data.zone,
      notes: "Walk-in emitido en Taquilla Express",
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Selector de Evento y Resumen Rápido */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Capa 1: Operación Presencial</span>
          <h1 className="text-xl font-serif text-[#1b2a4a] font-medium mt-0.5">Taquilla Express e Ingreso por Cédula</h1>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="taquilla-event-select" className="text-xs font-medium text-slate-600">Evento Activo:</label>
          <select
            id="taquilla-event-select"
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSearchedTicket(null);
              setSearchFeedback(null);
            }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.date} {evt.time})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Métricas rápidas de aforo para el taquillero */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Capacidad Total</span>
          <p className="text-2xl font-serif font-medium text-slate-900 mt-1">{capacity.totalCapacity}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pre-reservas</span>
          <p className="text-2xl font-serif font-medium text-indigo-900 mt-1">{capacity.preReservedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">En Sala (Ingresados)</span>
          <p className="text-2xl font-serif font-medium text-emerald-600 mt-1">{capacity.checkedInCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Disponibles Walk-in</span>
          <p className="text-2xl font-serif font-medium text-amber-600 mt-1">{capacity.availableRemaining}</p>
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
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{searchFeedback}</span>
          </div>
          <button
            onClick={() => setIsQuickRegisterOpen(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors"
          >
            Registrar como Walk-In
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
