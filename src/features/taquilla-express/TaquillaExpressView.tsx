import { useState, useEffect } from "react";
import { Users, QrCode, Grid, AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
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
import { toast } from "sonner";

export function TaquillaExpressView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
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
      {/* Header Taquilla */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase text-teatro-blue dark:text-blue-400 tracking-widest font-semibold">Mesa 1 • Registro & Walk-In</span>
          <h1 className="text-xl text-slate-900 dark:text-white font-bold tracking-tight mt-0.5">Taquilla Presencial y Asignación de Butacas</h1>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs">
            <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0" style={{ backgroundColor: currentEvent.braceletColorHex || "#004ea2" }} />
            <span className="text-slate-600 dark:text-slate-300">Brazalete: <strong className="text-slate-900 dark:text-white font-bold">{currentEvent.braceletColorName || "Azul Rey"}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSearchedTicket(null);
              setSearchFeedback(null);
              setSelectedSeatIds([]);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.title} ({evt.time} hrs)</option>
            ))}
          </select>
          <button onClick={() => setIsGroupModalOpen(true)} className="px-3.5 py-2 bg-teatro-blue hover:bg-teatro-blue-hover text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Users className="w-3.5 h-3.5" />
            <span>Sugerir Grupo</span>
          </button>
          <button onClick={() => setIsDeskQrOpen(true)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-[#1a3357]">
            <QrCode className="w-3.5 h-3.5 text-teatro-blue" />
            <span>QR Mesa</span>
          </button>
          <button onClick={() => setShowMatrix(!showMatrix)} className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${showMatrix ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300" : "bg-slate-100 dark:bg-[#071324] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#1a3357]"}`}>
            <Grid className="w-3.5 h-3.5" />
            <span>{showMatrix ? "Ocultar Matriz" : "Ver Matriz"}</span>
          </button>
        </div>
      </div>

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
