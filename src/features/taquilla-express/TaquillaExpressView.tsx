import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { TaquillaHeaderPanel } from "./TaquillaHeaderPanel";
import { BraceletCounterSection } from "../bracelet-counter/BraceletCounterSection";
import { BraceletColorPickerModal } from "../bracelet-counter/BraceletColorPickerModal";
import { EventConfigModal } from "../admin/EventConfigModal";
import { BraceletHistoryModal } from "../bracelet-counter/BraceletHistoryModal";
import { CitizenSearchForm } from "./CitizenSearchForm";
import { QuickRegisterModal } from "./QuickRegisterModal";
import { SearchResultCard } from "./SearchResultCard";
import { RecentEntriesList } from "./RecentEntriesList";
import { BraceletColor, Ticket, ZoneId } from "../tickets/types";
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

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);

  const currentEvent =
    store.events.find((e) => e.id === selectedEventId) ||
    findActiveEventForDate(store.events) ||
    store.events[0];

  const counterData = store.braceletCountersByEvent?.[currentEvent.id] || {
    eventId: currentEvent.id,
    deliveredCount: 0,
    history: [],
  };

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

  const handleSaveColor = (color: BraceletColor) => {
    store.setEventBraceletColor(currentEvent.id, color);
  };

  const recentEntries = store.tickets
    .filter((t) => t.eventId === currentEvent.id && t.checkedIn)
    .slice(0, 5);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-3 pb-24 space-y-3 text-slate-900 dark:text-slate-100 select-none overflow-x-hidden min-w-0">
      {/* 1. ZONA SUPERIOR: Información de Evento, Botones Utils y Pestañas */}
      <TaquillaHeaderPanel
        currentEvent={currentEvent}
        upcomingEvents={upcomingEvents}
        selectedEventId={selectedEventId}
        onSelectEventId={(id) => {
          setSelectedEventId(id);
          setSearchedTicket(null);
          setSearchFeedback(null);
        }}
        activeSubView={activeSubView}
        onSelectSubView={setActiveSubView}
        historyCount={counterData.history?.length || 0}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenColorPicker={() => setIsColorPickerOpen(true)}
      />

      {/* 2. ZONAS MEDIA E INFERIOR: Telemetría Radial y Botonera Ergonómica */}
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

      {/* Modales Utilitarios Bajo Demanda */}
      <BraceletColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        currentColorHex={currentEvent.braceletColorHex}
        currentColorName={currentEvent.braceletColorName}
        availableColors={store.braceletColors}
        onSaveColor={handleSaveColor}
      />

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        braceletColors={store.braceletColors}
        onSave={(updated) => store.updateEvent(updated)}
      />

      <BraceletHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={counterData.history || []}
      />

      <QuickRegisterModal
        isOpen={isQuickRegisterOpen}
        onClose={() => setIsQuickRegisterOpen(false)}
        event={currentEvent}
        onRegister={handleQuickRegister}
      />
    </div>
  );
}
