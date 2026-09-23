import { CheckCircle2, UserCheck, Armchair } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";

interface SearchResultCardProps {
  ticket: Ticket;
  event: TheaterEvent;
  onCheckIn: (ticketId: string) => void;
}

export function SearchResultCard({ ticket, event, onCheckIn }: SearchResultCardProps) {
  return (
    <div className="bg-[#111827] border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif text-white font-medium">{ticket.citizenName}</h3>
            {ticket.isVipGuest && (
              <span className="px-2.5 py-0.5 text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full font-mono">
                Protocolo VIP
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Cédula: {ticket.citizenId} • Tiquete: {ticket.id.slice(0, 12)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1 font-mono text-amber-400">
              <Armchair className="w-3.5 h-3.5" />
              {ticket.seatLabel ? `Butaca ${ticket.seatLabel}` : `Zona ${ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"}`}
            </span>
            <span>•</span>
            <span className="text-slate-400">{event.title}</span>
          </div>
        </div>

        <div>
          {ticket.checkedIn ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 rounded-2xl border border-emerald-500/30 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ingresado a las {new Date(ticket.checkedInAt || "").toLocaleTimeString()}</span>
            </div>
          ) : (
            <button
              onClick={() => onCheckIn(ticket.id)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
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
