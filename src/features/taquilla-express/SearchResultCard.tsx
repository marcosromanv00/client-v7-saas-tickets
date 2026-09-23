import { CheckCircle2, UserCheck, Armchair } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";

interface SearchResultCardProps {
  ticket: Ticket;
  event: TheaterEvent;
  onCheckIn: (ticketId: string) => void;
}

export function SearchResultCard({ ticket, event, onCheckIn }: SearchResultCardProps) {
  return (
    <div className="bg-white border-2 border-[#1b2a4a] rounded-xl p-6 shadow-sm animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif text-slate-900 font-medium">{ticket.citizenName}</h3>
            {ticket.isVipGuest && (
              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-900 rounded font-medium">Invitado VIP</span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Cédula: {ticket.citizenId} | Tiquete: {ticket.id.slice(0, 12)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-700">
            <span className="flex items-center gap-1">
              <Armchair className="w-3.5 h-3.5 text-slate-400" />
              {ticket.seatLabel ? `Butaca ${ticket.seatLabel}` : `Zona ${ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"}`}
            </span>
            <span>•</span>
            <span>{event.title}</span>
          </div>
        </div>

        <div>
          {ticket.checkedIn ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ingresado a las {new Date(ticket.checkedInAt || "").toLocaleTimeString()}</span>
            </div>
          ) : (
            <button
              onClick={() => onCheckIn(ticket.id)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Validar e Ingresar a Sala</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
