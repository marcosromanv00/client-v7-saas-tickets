import React, { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";

interface TicketsTableProps {
  tickets: Ticket[];
  currentEvent: TheaterEvent;
  onCheckIn: (ticketId: string) => void;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({ tickets, currentEvent, onCheckIn }) => {
  const [ticketFilter, setTicketFilter] = useState<"ALL" | "CHECKED_IN" | "PENDING">("ALL");

  const eventTickets = tickets.filter((t) => {
    if (t.eventId !== currentEvent.id) return false;
    if (ticketFilter === "CHECKED_IN") return t.checkedIn;
    if (ticketFilter === "PENDING") return !t.checkedIn;
    return true;
  });

  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-serif text-base text-white font-medium">Registro de Tiquetes Emitidos</h3>
          <p className="text-xs text-slate-400">Auditoría de acreditaciones para esta función ({eventTickets.length} registros)</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl text-xs border border-slate-800">
          <button
            onClick={() => setTicketFilter("ALL")}
            className={`px-3 py-1 rounded-lg transition-colors ${ticketFilter === "ALL" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
          >
            Todos
          </button>
          <button
            onClick={() => setTicketFilter("CHECKED_IN")}
            className={`px-3 py-1 rounded-lg transition-colors ${ticketFilter === "CHECKED_IN" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
          >
            En Sala ({tickets.filter((t) => t.eventId === currentEvent.id && t.checkedIn).length})
          </button>
          <button
            onClick={() => setTicketFilter("PENDING")}
            className={`px-3 py-1 rounded-lg transition-colors ${ticketFilter === "PENDING" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
          >
            Pendientes ({tickets.filter((t) => t.eventId === currentEvent.id && !t.checkedIn).length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-3 rounded-l-xl">Espectador</th>
              <th className="p-3">Cédula</th>
              <th className="p-3">Ubicación</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado de Ingreso</th>
              <th className="p-3 rounded-r-xl text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {eventTickets.map((tkt) => (
              <tr key={tkt.id} className="hover:bg-slate-900/40">
                <td className="p-3 font-medium text-white">{tkt.citizenName}</td>
                <td className="p-3 font-mono text-slate-400">{tkt.citizenId}</td>
                <td className="p-3 font-mono text-amber-400 font-bold">{tkt.seatLabel || (tkt.zone === "PLANTA_BAJA" ? "Platea" : "Balcón")}</td>
                <td className="p-3">
                  {tkt.isVipGuest ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono">Protocolo</span>
                  ) : (
                    <span className="text-slate-500">General</span>
                  )}
                </td>
                <td className="p-3">
                  {tkt.checkedIn ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En Sala ({tkt.checkedInAt ? new Date(tkt.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> Pendiente
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {!tkt.checkedIn && (
                    <button
                      onClick={() => onCheckIn(tkt.id)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors shadow-sm"
                    >
                      Check-In
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
