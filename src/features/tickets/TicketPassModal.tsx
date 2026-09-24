import React from "react";
import { Ticket } from "./types";
import { useTheaterStore } from "./useTheaterStore";
import { TicketPassCard } from "../qr-access/TicketPassCard";
import { X } from "lucide-react";

interface TicketPassModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ ticket, onClose }) => {
  const store = useTheaterStore();
  const event = store.events.find((e) => e.id === ticket.eventId) || store.events[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <TicketPassCard ticket={ticket} event={event} />
      </div>
    </div>
  );
};
