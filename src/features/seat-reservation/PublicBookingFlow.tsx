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
          colors: ["#f43f5e", "#c59b27", "#38bdf8"],
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-[#171717]">
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
