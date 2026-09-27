import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { TaquillaExpressHeader } from "./TaquillaExpressHeader";
import { CitizenSearchForm } from "./CitizenSearchForm";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { GroupSuggestionModal } from "./GroupSuggestionModal";
import { DeskQrDisplayModal } from "./DeskQrDisplayModal";
import { SearchResultCard } from "./SearchResultCard";
import { RecentEntriesList } from "./RecentEntriesList";
import { TaquillaMetricsBar } from "./TaquillaMetricsBar";
import { TheaterSeatMap } from "../seat-reservation/TheaterSeatMap";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { findNextBestAvailableSeat } from "../tickets/hybrid-seating-utils";
import { Ticket, ZoneId, Seat } from "../tickets/types";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
  isGeneralAdmissionEvent,
} from "../tickets/event-date-utils";
import { toast } from "sonner";

export function TaquillaExpressView() {
  const store = useTheaterStore();
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [searchedTicket, setSearchedTicket] = useState<Ticket | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeskQrOpen, setIsDeskQrOpen] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  useEffect(() => {
    store.checkAndReleaseUnclaimed();
  }, [selectedEventId]);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || findActiveEventForDate(store.events) || store.events[0];
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
    if (res.success && res.ticket) setSearchedTicket(res.ticket);
  };

  const handleQuickRegister = (data: { citizenName: string; citizenId: string; zone: ZoneId }) => {
    const nextBestSeat = findNextBestAvailableSeat(eventSeats);
    const res = store.bookTicket({
      eventId: currentEvent.id,
      citizenName: data.citizenName,
      citizenId: data.citizenId,
      seatId: nextBestSeat ? nextBestSeat.id : null,
      zone: nextBestSeat ? nextBestSeat.zone : data.zone,
      notes: nextBestSeat ? `Acomodo individual (${nextBestSeat.label})` : "Walk-in emitido en Taquilla",
    });
    if (res.success && res.ticket) {
      store.checkInTicket(res.ticket.id);
      setSearchedTicket({ ...res.ticket, checkedIn: true, checkedInAt: new Date().toISOString() });
      toast.success("Boleto emitido y acreditado.");
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleBatchGroupRegister = (data: { leaderName: string; leaderId: string; seatIds: string[] }) => {
    const res = store.batchBookGroup({
      eventId: currentEvent.id,
      leaderName: data.leaderName,
      leaderId: data.leaderId,
      seatIds: data.seatIds,
    });
    if (res.success && res.tickets) {
      setSelectedSeatIds([]);
      toast.success(`Se emitieron y acreditaron ${res.tickets.length} boletos del grupo.`);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  const recentEntries = store.tickets
    .filter((t) => t.eventId === currentEvent.id && t.checkedIn)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 space-y-7 text-slate-900 dark:text-slate-100">
      {/* Header Taquilla con soporte para admin de modificar color y butacas */}
      <TaquillaExpressHeader
        currentEvent={currentEvent}
        selectedEventId={selectedEventId}
        onSelectEventId={(id) => {
          setSelectedEventId(id);
          setSearchedTicket(null);
          setSearchFeedback(null);
          setSelectedSeatIds([]);
        }}
        upcomingEvents={upcomingEvents}
        isGeneralAdmission={isGeneralAdmissionEvent(currentEvent)}
        deliveredCount={store.braceletCountersByEvent?.[currentEvent.id]?.deliveredCount || 0}
        onOpenGroupModal={() => setIsGroupModalOpen(true)}
        onOpenDeskQr={() => setIsDeskQrOpen(true)}
        showMatrix={showMatrix}
        onToggleMatrix={() => setShowMatrix(!showMatrix)}
      />

      <TaquillaMetricsBar capacity={capacity} />

      <CitizenSearchForm onSearch={handleSearch} onOpenQuickRegister={() => setIsQuickRegisterOpen(true)} />

      {searchedTicket && <SearchResultCard ticket={searchedTicket} event={currentEvent} onCheckIn={handleCheckIn} />}

      {searchFeedback && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{searchFeedback}</span>
          </div>
          <button onClick={() => setIsQuickRegisterOpen(true)} className="px-3.5 py-1.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl text-xs cursor-pointer">
            Emitir como Walk-In
          </button>
        </div>
      )}

      {showMatrix && (
        <div className="bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight">Matriz de Sala en Vivo (3 Niveles)</h2>
            {selectedSeatIds.length > 0 && (
              <span className="text-xs text-teatro-blue font-bold font-mono">
                {selectedSeatIds.length} butaca(s) pre-seleccionada(s)
              </span>
            )}
          </div>
          <TheaterSeatMap seats={eventSeats} selectedSeatIds={selectedSeatIds} onToggleSeat={handleToggleSeat} allowVipSelection />
        </div>
      )}

      <RecentEntriesList entries={recentEntries} />

      <QuickRegisterModal isOpen={isQuickRegisterOpen} onClose={() => setIsQuickRegisterOpen(false)} event={currentEvent} onRegister={handleQuickRegister} />
      <GroupSuggestionModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} event={currentEvent} seats={eventSeats} onApplyToMatrix={(seatIds) => { setSelectedSeatIds(seatIds); setShowMatrix(true); }} onConfirmBatch={handleBatchGroupRegister} />
      <DeskQrDisplayModal isOpen={isDeskQrOpen} onClose={() => setIsDeskQrOpen(false)} event={currentEvent} />
    </div>
  );
}
