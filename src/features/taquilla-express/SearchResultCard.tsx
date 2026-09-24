import { CheckCircle2, UserCheck, Armchair } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";

interface SearchResultCardProps {
  ticket: Ticket;
  event: TheaterEvent;
  onCheckIn: (ticketId: string) => void;
}

export function SearchResultCard({ ticket, event, onCheckIn }: SearchResultCardProps) {
  return (
    <div className="bg-white dark:bg-[#0b1a30] border-2 border-[#004ea2] dark:border-blue-500 rounded-3xl p-6 shadow-sm animate-in fade-in transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-slate-900 dark:text-white font-bold tracking-tight">{ticket.citizenName}</h3>
            {ticket.isVipGuest && (
              <span className="px-2.5 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-full font-mono font-semibold">
                Protocolo VIP
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Cédula: {ticket.citizenId} • Tiquete: {ticket.id.slice(0, 12)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 font-mono text-[#004ea2] dark:text-blue-400 font-semibold">
              <Armchair className="w-3.5 h-3.5" />
              {ticket.seatLabel ? `Butaca ${ticket.seatLabel}` : `Zona ${ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"}`}
            </span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">{event.title}</span>
          </div>
        </div>

        <div>
          {ticket.checkedIn ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ingresado a las {new Date(ticket.checkedInAt || "").toLocaleTimeString()}</span>
            </div>
          ) : (
            <button
              onClick={() => onCheckIn(ticket.id)}
              className="px-6 py-3 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-2xl text-xs transition-all shadow-md shadow-red-900/20 flex items-center gap-2 cursor-pointer"
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
