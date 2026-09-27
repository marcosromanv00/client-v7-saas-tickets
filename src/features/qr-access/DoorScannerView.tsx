import { useState, useEffect } from "react";
import { ListFilter, QrCode, Tag } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { DoorValidationResult, ValidationOutcome } from "./DoorValidationResult";
import { DoorEventHeader } from "./DoorEventHeader";
import { DoorOpticalScannerSection } from "./DoorOpticalScannerSection";
import { AttendeeVerificationView } from "../attendee-verification/AttendeeVerificationView";
import { BraceletCounterSection } from "../bracelet-counter/BraceletCounterSection";
import { Ticket } from "../tickets/types";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
  isGeneralAdmissionEvent,
} from "../tickets/event-date-utils";

type DoorViewMode = "BRAZALETES" | "LIST" | "SCANNER";

export function DoorScannerView() {
  const store = useTheaterStore();
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const currentEvent =
    store.events.find((e) => e.id === selectedEventId) ||
    upcomingEvents[0] ||
    findActiveEventForDate(store.events) ||
    store.events[0];

  const isGeneralAdmission = isGeneralAdmissionEvent(currentEvent);

  const [viewMode, setViewMode] = useState<DoorViewMode>(() =>
    isGeneralAdmission ? "BRAZALETES" : "LIST"
  );
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Ejecución automática de liberación 15 minutos antes según reloj real
  useEffect(() => {
    store.checkAndReleaseUnclaimed();
  }, [selectedEventId]);

  const eventTickets = store.tickets.filter((t) => t.eventId === currentEvent.id);

  const processScan = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    const res = store.checkInByCode(code);
    if (res.status === "VALID" && res.ticket) {
      setValidationOutcome("SUCCESS");
      setActiveTicket(res.ticket);
      const deliversBracelet = currentEvent.mode === "GENERAL_ADMISSION" || currentEvent.ticketStyle !== "UNICO" || currentEvent.braceletColorId !== undefined;
      if (deliversBracelet) {
        store.updateBraceletCount(currentEvent.id, 1, `QR: ${res.ticket.citizenName}`);
      }
    } else if (res.status === "RELEASED_NO_SHOW" && res.ticket) {
      setValidationOutcome("RELEASED_NO_SHOW");
      setActiveTicket(res.ticket);
    } else if (res.status === "ALREADY_CHECKED_IN" && res.ticket) {
      setValidationOutcome("ALREADY_CHECKED_IN");
      setActiveTicket(res.ticket);
    } else {
      setValidationOutcome("INVALID_QR");
      setActiveTicket(null);
      setErrorMessage(res.error || `El código "${code}" no fue encontrado en la base de datos.`);
    }
  };

  useEffect(() => {
    if (isGeneralAdmission) {
      setViewMode("BRAZALETES");
    } else if (viewMode === "BRAZALETES") {
      setViewMode("LIST");
    }
  }, [currentEvent.id, isGeneralAdmission]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <DoorEventHeader
        events={upcomingEvents}
        selectedEventId={selectedEventId}
        onSelectEventId={setSelectedEventId}
        currentEvent={currentEvent}
      />

      {isGeneralAdmission ? (
        /* Modo 100% Dedicado para Hoy: Solo Entrega de Brazalete y Conteo sin Listas ni Registro */
        <BraceletCounterSection currentEvent={currentEvent} />
      ) : (
        <>
          {/* Conmutador de Modos de Puerta para Eventos Numerados */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-1.5 bg-slate-100/80 dark:bg-[#071324]/80 backdrop-blur-xs rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("LIST")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "LIST"
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5 text-teatro-blue dark:text-white shrink-0" />
                <span>Padrón</span>
              </button>

              <button
                onClick={() => setViewMode("SCANNER")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "SCANNER"
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-teatro-blue dark:text-white shrink-0" />
                <span>Escáner QR</span>
              </button>

              <button
                onClick={() => setViewMode("BRAZALETES")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "BRAZALETES"
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-teatro-blue dark:text-white shrink-0" />
                <span>Brazaletes</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center sm:text-right pr-2">
              {eventTickets.filter((t) => t.checkedIn).length} / {currentEvent.totalCapacity} acreditados
            </span>
          </div>

          {/* Vista Activa */}
          {viewMode === "BRAZALETES" ? (
            <BraceletCounterSection currentEvent={currentEvent} />
          ) : viewMode === "LIST" ? (
            <AttendeeVerificationView currentEvent={currentEvent} />
          ) : (
            <DoorOpticalScannerSection
              eventTickets={eventTickets}
              onProcessScan={processScan}
            />
          )}

          {/* Resultado de Validación para Escáner */}
          <DoorValidationResult
            outcome={validationOutcome}
            ticket={activeTicket}
            event={currentEvent}
            errorMessage={errorMessage}
            onDismiss={() => {
              setValidationOutcome(null);
              setActiveTicket(null);
            }}
          />
        </>
      )}
    </div>
  );
}
