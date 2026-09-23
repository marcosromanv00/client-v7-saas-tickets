import { useState } from "react";
import { Sliders, RotateCcw, CheckCircle2, Clock } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { CapacityMonitor } from "./CapacityMonitor";
import { SpecialGuestsManager } from "./SpecialGuestsManager";
import { EventConfigModal } from "./EventConfigModal";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { TheaterEvent } from "../tickets/types";

export function AdminDashboard() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<"ALL" | "CHECKED_IN" | "PENDING">("ALL");

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const capacity = computeDynamicCapacity(currentEvent, store.tickets, store.specialGuests, eventSeats);

  const eventTickets = store.tickets.filter((t) => {
    if (t.eventId !== currentEvent.id) return false;
    if (ticketFilter === "CHECKED_IN") return t.checkedIn;
    if (ticketFilter === "PENDING") return !t.checkedIn;
    return true;
  });

  const handleSaveEvent = (updated: TheaterEvent) => {
    store.updateEvent(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-7 text-slate-100">
      {/* Barra Superior del Panel Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1626]/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest">Capa Interna • Productora & Protocolo</span>
          <h1 className="text-xl font-serif text-white font-medium mt-0.5">Consola de Control de Aforo y Producción</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsConfigOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configurar Evento</span>
          </button>

          <button
            onClick={() => store.resetStore()}
            title="Reiniciar a datos iniciales de fábrica"
            className="p-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monitor de Aforo Dinámico */}
      <CapacityMonitor capacity={capacity} eventTitle={currentEvent.title} />

      {/* Gestor de Invitados Especiales y Protocolo */}
      <SpecialGuestsManager event={currentEvent} />

      {/* Tabla de Tiquetes Emitidos y Control de Ingreso */}
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
              En Sala ({store.tickets.filter((t) => t.eventId === currentEvent.id && t.checkedIn).length})
            </button>
            <button
              onClick={() => setTicketFilter("PENDING")}
              className={`px-3 py-1 rounded-lg transition-colors ${ticketFilter === "PENDING" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Pendientes ({store.tickets.filter((t) => t.eventId === currentEvent.id && !t.checkedIn).length})
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
                        onClick={() => store.checkInTicket(tkt.id)}
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

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
