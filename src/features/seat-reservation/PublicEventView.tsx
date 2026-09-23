import { useState } from "react";
import confetti from "canvas-confetti";
import { Calendar, Clock, MapPin, Sparkles, X, ShieldAlert } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { TheaterSeatMap } from "./TheaterSeatMap";
import { GeneralAdmissionView } from "./GeneralAdmissionView";
import { ReservationSummary } from "./ReservationSummary";
import { TicketPassCard } from "../qr-access/TicketPassCard";
import { Seat, Ticket, ZoneId } from "../tickets/types";

export function PublicEventView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[1]?.id || store.events[0]?.id || "");
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneId>("PLANTA_BAJA");
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const seats = store.seatsByEvent[currentEvent.id] || [];

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeat(selectedSeat?.id === seat.id ? null : seat);
  };

  const handleConfirmReservation = (data: { citizenName: string; citizenId: string; citizenPhone?: string }) => {
    const res = store.bookTicket({
      eventId: currentEvent.id,
      citizenName: data.citizenName,
      citizenId: data.citizenId,
      citizenPhone: data.citizenPhone,
      seatId: currentEvent.mode === "SEATED_NUMBERED" && selectedSeat ? selectedSeat.id : null,
      zone: selectedSeat ? selectedSeat.zone : selectedZone,
      notes: "Reserva web pública de butaca",
    });

    if (res.success && res.ticket) {
      setIssuedTicket(res.ticket);
      setSelectedSeat(null);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        console.warn("Confetti error", err);
      }
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const eventTickets = store.tickets.filter((t) => t.eventId === currentEvent.id);
  const pbCount = eventTickets.filter((t) => t.zone === "PLANTA_BAJA").length;
  const balconCount = eventTickets.filter((t) => t.zone === "BALCON").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Selector de Obras / Cartelera */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {store.events.map((evt) => {
          const isSelected = evt.id === currentEvent.id;
          return (
            <div
              key={evt.id}
              onClick={() => {
                setSelectedEventId(evt.id);
                setSelectedSeat(null);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-white border-[#1b2a4a] shadow-md ring-2 ring-[#1b2a4a]/20"
                  : "bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                <span className="flex items-center gap-1 font-semibold text-[#1b2a4a]">
                  <Calendar className="w-3.5 h-3.5" /> {evt.date}
                </span>
                <span>{evt.time} hrs</span>
              </div>
              <h3 className="font-serif text-base font-medium text-slate-900 line-clamp-1">{evt.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded font-mono ${
                  evt.mode === "SEATED_NUMBERED" ? "bg-amber-100 text-amber-900" : "bg-indigo-100 text-indigo-900"
                }`}>
                  {evt.mode === "SEATED_NUMBERED" ? "Butaca Numerada" : "Aforo General"}
                </span>
                {evt.isPrivate && <span className="text-rose-700 font-medium">Privado Protocolo</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero del Evento Seleccionado */}
      <div className="bg-[#1b2a4a] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest text-amber-300 uppercase">Cartelera Oficial del Teatro</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium">{currentEvent.title}</h1>
            <p className="text-sm text-slate-300 max-w-2xl">{currentEvent.description}</p>
          </div>

          <div className="bg-[#233858] border border-amber-400/20 p-4 rounded-xl text-xs space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Duración estimada: {currentEvent.durationMinutes} minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{currentEvent.location}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-emerald-300 pt-1">
              <Sparkles className="w-4 h-4" />
              <span>Entrada Gratuita y Libre</span>
            </div>
          </div>
        </div>

        {currentEvent.isPrivate && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-lg flex items-center gap-2 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Esta función es una gala privada con invitación directa y acreditación de protocolo municipal.</span>
          </div>
        )}
      </div>

      {/* Contenido Principal: Plano Interactivo o Aforo General + Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {currentEvent.mode === "SEATED_NUMBERED" ? (
            <TheaterSeatMap
              seats={seats}
              selectedSeatId={selectedSeat?.id || null}
              onSelectSeat={handleSelectSeat}
              allowVipSelection={currentEvent.isPrivate}
            />
          ) : (
            <GeneralAdmissionView
              event={currentEvent}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              pbReserved={pbCount}
              balconReserved={balconCount}
            />
          )}
        </div>

        <div className="lg:col-span-1 sticky top-24">
          <ReservationSummary
            event={currentEvent}
            selectedSeat={selectedSeat}
            selectedZone={selectedZone}
            onConfirmReservation={handleConfirmReservation}
          />
        </div>
      </div>

      {/* Modal de Tiquete Emitido */}
      {issuedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setIssuedTicket(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-white text-slate-800 rounded-full shadow-md flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <TicketPassCard ticket={issuedTicket} event={currentEvent} />
          </div>
        </div>
      )}
    </div>
  );
}
