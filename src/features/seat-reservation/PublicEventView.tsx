import { useState } from "react";
import confetti from "canvas-confetti";
import { X, ArrowLeft } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { TheaterSeatMap } from "./TheaterSeatMap";
import { DateTimeSelector } from "./DateTimeSelector";
import { ReservationSummary } from "./ReservationSummary";
import { GeneralAdmissionView } from "./GeneralAdmissionView";
import { TicketPassCard } from "../qr-access/TicketPassCard";
import { EventPosterHero } from "./EventPosterHero";
import { Seat, Ticket, ZoneId } from "../tickets/types";

export function PublicEventView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [mobileStep, setMobileStep] = useState<"detail" | "seats">("detail");
  const [selectedDate, setSelectedDate] = useState("2026-09-25");
  const [selectedTime, setSelectedTime] = useState("19:00");
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
      notes: `Reserva web • ${selectedDate} ${selectedTime}`,
    });

    if (res.success && res.ticket) {
      setIssuedTicket(res.ticket);
      setSelectedSeat(null);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        console.warn(err);
      }
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const eventTickets = store.tickets.filter((t) => t.eventId === currentEvent.id);
  const pbCount = eventTickets.filter((t) => t.zone === "PLANTA_BAJA").length;
  const balconCount = eventTickets.filter((t) => t.zone === "BALCON").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-slate-100">
      {/* Selector Rápido de Obras en Cartelera */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6">
        {store.events.map((evt) => {
          const isSelected = evt.id === currentEvent.id;
          return (
            <button
              key={evt.id}
              onClick={() => {
                setSelectedEventId(evt.id);
                setSelectedSeat(null);
                setMobileStep("detail");
              }}
              className={`flex items-center gap-3 p-2.5 pr-4 rounded-2xl border transition-all shrink-0 ${
                isSelected
                  ? "bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 text-white"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <img src={evt.posterUrl} alt={evt.title} className="w-10 h-10 rounded-xl object-cover" />
              <div className="text-left">
                <p className="text-xs font-serif font-medium line-clamp-1">{evt.title}</p>
                <span className="text-[10px] font-mono text-amber-400">{evt.date} • {evt.time}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Vista Móvil: Pantalla 1 (Detalle y Selector Fecha) vs Pantalla 2 (Elegir Butacas) */}
      <div className="block lg:hidden">
        {mobileStep === "detail" ? (
          <div className="space-y-6">
            <EventPosterHero event={currentEvent} variant="mobile" />

            <DateTimeSelector
              dates={currentEvent.datesAvailable || []}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              timeSlots={currentEvent.timeSlots || []}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />

            <button
              onClick={() => setMobileStep("seats")}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>Continuar a Selección de Butacas</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setMobileStep("detail")} className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <ArrowLeft className="w-4 h-4" /> <span>Volver a la Obra</span>
              </button>
              <h2 className="text-base font-serif font-medium">Elegir Butacas</h2>
              <span className="text-xs font-mono text-slate-400">{selectedTime} hrs</span>
            </div>

            {currentEvent.mode === "SEATED_NUMBERED" ? (
              <TheaterSeatMap seats={seats} selectedSeatId={selectedSeat?.id || null} onSelectSeat={handleSelectSeat} allowVipSelection={currentEvent.isPrivate} />
            ) : (
              <GeneralAdmissionView event={currentEvent} selectedZone={selectedZone} onSelectZone={setSelectedZone} pbReserved={pbCount} balconReserved={balconCount} />
            )}

            <ReservationSummary event={currentEvent} selectedSeat={selectedSeat} selectedZone={selectedZone} selectedDate={selectedDate} selectedTime={selectedTime} onConfirmReservation={handleConfirmReservation} />
          </div>
        )}
      </div>

      {/* Vista de Escritorio: Expansiva Panorámica 3 Columnas (Productora / Computadora) */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
        {/* Columna 1: Póster y Sinopsis (4 cols) */}
        <div className="col-span-4 space-y-6">
          <EventPosterHero event={currentEvent} variant="desktop" />

          <DateTimeSelector
            dates={currentEvent.datesAvailable || []}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            timeSlots={currentEvent.timeSlots || []}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        </div>

        {/* Columna 2: Plano de Butacas o Aforo General (5 cols) */}
        <div className="col-span-5">
          {currentEvent.mode === "SEATED_NUMBERED" ? (
            <TheaterSeatMap seats={seats} selectedSeatId={selectedSeat?.id || null} onSelectSeat={handleSelectSeat} allowVipSelection={currentEvent.isPrivate} />
          ) : (
            <GeneralAdmissionView event={currentEvent} selectedZone={selectedZone} onSelectZone={setSelectedZone} pbReserved={pbCount} balconReserved={balconCount} />
          )}
        </div>

        {/* Columna 3: Formulario de Acreditación y Resumen (3 cols) */}
        <div className="col-span-3 sticky top-24">
          <ReservationSummary
            event={currentEvent}
            selectedSeat={selectedSeat}
            selectedZone={selectedZone}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onConfirmReservation={handleConfirmReservation}
          />
        </div>
      </div>

      {/* Modal de Tiquete Notched Emitido */}
      {issuedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative max-w-sm w-full">
            <button
              onClick={() => setIssuedTicket(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-slate-900 text-white border border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
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
