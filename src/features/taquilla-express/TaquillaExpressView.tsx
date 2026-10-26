import { useState } from "react";
import { Ticket as TicketIcon, Search, AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { BraceletCounterSection } from "../bracelet-counter/BraceletCounterSection";
import { CitizenSearchForm } from "./CitizenSearchForm";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { SearchResultCard } from "./SearchResultCard";
import { RecentEntriesList } from "./RecentEntriesList";
import { Ticket, ZoneId } from "../tickets/types";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
} from "../tickets/event-date-utils";
import { toast } from "sonner";

export function TaquillaExpressView() {
  const store = useTheaterStore();
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [activeSubView, setActiveSubView] = useState<"brazaletes" | "cortesias">("brazaletes");
  const [searchedTicket, setSearchedTicket] = useState<Ticket | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);

  const currentEvent =
    store.events.find((e) => e.id === selectedEventId) ||
    findActiveEventForDate(store.events) ||
    store.events[0];

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
    if (res.success && res.ticket) setSearchedTicket(res.ticket);
  };

  const handleQuickRegister = (data: { citizenName: string; citizenId: string; zone: ZoneId }) => {
    const res = store.bookTicket({
      eventId: currentEvent.id,
      citizenName: data.citizenName,
      citizenId: data.citizenId,
      seatId: null,
      zone: data.zone,
      notes: "Walk-in emitido en Taquilla",
    });
    if (res.success && res.ticket) {
      store.checkInTicket(res.ticket.id);
      setSearchedTicket({ ...res.ticket, checkedIn: true, checkedInAt: new Date().toISOString() });
      toast.success("Boleto emitido y acreditado.");
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const recentEntries = store.tickets
    .filter((t) => t.eventId === currentEvent.id && t.checkedIn)
    .slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 pb-20 sm:pb-24 space-y-2.5 text-slate-900 dark:text-slate-100 select-none overflow-x-hidden min-w-0">
      {/* 1. Selector Superior de Función y Pestañas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 w-full min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 w-full sm:w-auto">
          <span className="text-2xs font-mono uppercase tracking-wider text-slate-400 font-semibold shrink-0">
            Función:
          </span>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSearchedTicket(null);
              setSearchFeedback(null);
            }}
            className="w-full sm:w-72 truncate min-w-0 px-2.5 py-1.5 bg-white dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 28 ? `${evt.title.slice(0, 26)}...` : evt.title} ({evt.time})
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Modo: Brazaletes (Default) vs Cortesías */}
        <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubView("brazaletes")}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubView === "brazaletes"
                ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TicketIcon className="w-3.5 h-3.5" />
            <span className="truncate">Brazaletes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView("cortesias")}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubView === "cortesias"
                ? "bg-white dark:bg-slate-800 text-teatro-blue dark:text-blue-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate">Cortesías</span>
          </button>
        </div>
      </div>

      {/* 2. Vista Principal de Entrega de Brazaletes (Por Defecto) */}
      {activeSubView === "brazaletes" ? (
        <BraceletCounterSection currentEvent={currentEvent} />
      ) : (
        <div className="space-y-4">
          <CitizenSearchForm onSearch={handleSearch} onOpenQuickRegister={() => setIsQuickRegisterOpen(true)} />

          {searchedTicket && <SearchResultCard ticket={searchedTicket} event={currentEvent} onCheckIn={handleCheckIn} />}

          {searchFeedback && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{searchFeedback}</span>
              </div>
              <button
                onClick={() => setIsQuickRegisterOpen(true)}
                className="px-3 py-1.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                Emitir como Walk-In
              </button>
            </div>
          )}

          <RecentEntriesList entries={recentEntries} />
        </div>
      )}

      <QuickRegisterModal
        isOpen={isQuickRegisterOpen}
        onClose={() => setIsQuickRegisterOpen(false)}
        event={currentEvent}
        onRegister={handleQuickRegister}
      />
    </div>
  );
}
