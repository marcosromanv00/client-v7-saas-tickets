import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { Seat, TheaterEvent, Ticket } from "../tickets/types";
import { Step1ShowSelection } from "./Step1ShowSelection";
import { Step2SeatSelection } from "./Step2SeatSelection";
import { Step3CheckoutForm } from "./Step3CheckoutForm";
import { Step4TicketSuccess } from "./Step4TicketSuccess";

export type BookingStep = "show" | "seats" | "checkout" | "success";

interface PublicBookingFlowProps {
  onOpenMyTickets?: () => void;
}

export const PublicBookingFlow: React.FC<PublicBookingFlowProps> = ({ onOpenMyTickets }) => {
  const store = useTheaterStore();
  const [currentStep, setCurrentStep] = useState<BookingStep>("show");
  const [selectedEventId, setSelectedEventId] = useState<string>(store.events[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-25");
  const [selectedTime, setSelectedTime] = useState<string>("19:00");
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [issuedTickets, setIssuedTickets] = useState<Ticket[]>([]);

  const selectedEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const seats = store.seatsByEvent[selectedEvent.id] || [];

  const handleSelectEvent = (evt: TheaterEvent) => {
    setSelectedEventId(evt.id);
    setSelectedDate(evt.datesAvailable?.[0]?.date || evt.date);
    setSelectedTime(evt.timeSlots?.[0] || evt.time);
    setSelectedSeatIds([]);
  };

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      if (prev.length >= 6) return prev; // Límite máximo de 6 butacas por reserva
      return [...prev, seat.id];
    });
  };

  const handleCheckoutSubmit = (data: {
    citizenName: string;
    citizenId: string;
    citizenEmail: string;
    citizenPhone?: string;
  }) => {
    const created: Ticket[] = [];

    // Emitir tiquete para cada butaca seleccionada
    selectedSeatIds.forEach((seatId) => {
      const seatObj = seats.find((s) => s.id === seatId);
      const res = store.bookTicket({
        eventId: selectedEvent.id,
        citizenName: data.citizenName,
        citizenId: data.citizenId,
        citizenPhone: data.citizenPhone,
        seatId: seatId,
        zone: seatObj?.zone || "PLANTA_BAJA",
        notes: `Función ${selectedDate} ${selectedTime}`,
      });
      if (res.success && res.ticket) {
        created.push(res.ticket);
      }
    });

    if (created.length > 0) {
      setIssuedTickets(created);
      setCurrentStep("success");
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#004ea2", "#c8102e", "#c59223", "#ffffff"],
        });
      } catch {}
    }
  };

  const handleReset = () => {
    setSelectedSeatIds([]);
    setIssuedTickets([]);
    setCurrentStep("show");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      {/* BARRA DE PROGRESO DE APP NATIVA */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-4 px-3 sm:px-5 py-2 bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-[#1e355b] text-xs shadow-xs">
        <button
          type="button"
          onClick={() => setCurrentStep("show")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${currentStep === "show" ? "bg-[#004ea2] text-white" : "bg-emerald-600 text-white"}`}>1</span>
          <span className={`hidden sm:inline ${currentStep === "show" ? "font-bold text-slate-900 dark:text-white" : "text-slate-500"}`}>Obra</span>
        </button>
        <div className="h-px w-4 sm:w-10 bg-slate-200 dark:bg-slate-700" />
        <button
          type="button"
          onClick={() => selectedEvent && setCurrentStep("seats")}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${currentStep === "seats" ? "bg-[#004ea2] text-white" : currentStep === "checkout" || currentStep === "success" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>2</span>
          <span className={`hidden sm:inline ${currentStep === "seats" ? "font-bold text-slate-900 dark:text-white" : "text-slate-500"}`}>Butacas</span>
        </button>
        <div className="h-px w-4 sm:w-10 bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${currentStep === "checkout" ? "bg-[#004ea2] text-white" : currentStep === "success" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>3</span>
          <span className={`hidden sm:inline ${currentStep === "checkout" ? "font-bold text-slate-900 dark:text-white" : "text-slate-500"}`}>Datos</span>
        </div>
        <div className="h-px w-4 sm:w-10 bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${currentStep === "success" ? "bg-[#c8102e] text-white shadow-xs" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>4</span>
          <span className={`hidden sm:inline ${currentStep === "success" ? "font-bold text-[#c8102e] dark:text-red-400" : "text-slate-500"}`}>Boleto</span>
        </div>
      </div>

      {currentStep === "show" && (
        <Step1ShowSelection
          events={store.events}
          selectedEvent={selectedEvent}
          onSelectEvent={handleSelectEvent}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          onProceedToSeats={() => setCurrentStep("seats")}
        />
      )}

      {currentStep === "seats" && (
        <Step2SeatSelection
          event={selectedEvent}
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          onToggleSeat={handleToggleSeat}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onBackToShow={() => setCurrentStep("show")}
          onProceedToCheckout={() => setCurrentStep("checkout")}
        />
      )}

      {currentStep === "checkout" && (
        <Step3CheckoutForm
          event={selectedEvent}
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onBackToSeats={() => setCurrentStep("seats")}
          onSubmit={handleCheckoutSubmit}
        />
      )}

      {currentStep === "success" && (
        <Step4TicketSuccess
          tickets={issuedTickets}
          event={selectedEvent}
          onResetToStart={handleReset}
          onOpenMyTickets={onOpenMyTickets}
        />
      )}
    </div>
  );
};

export const PublicEventView = PublicBookingFlow;
