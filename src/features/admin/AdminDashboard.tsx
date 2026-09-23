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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Barra Superior del Panel Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Capa Interna & Protocolo</span>
          <h1 className="text-xl font-serif text-[#1b2a4a] font-medium mt-0.5">Panel Administrativo de Control y Aforo</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.date} {evt.time})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsConfigOpen(true)}
            className="px-3.5 py-2 bg-[#1b2a4a] hover:bg-[#233858] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurar Evento</span>
          </button>

          <button
            onClick={() => store.resetStore()}
            title="Reiniciar a datos iniciales de fábrica"
            className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif text-base text-[#1b2a4a] font-medium">Registro de Tiquetes Emitidos</h3>
            <p className="text-xs text-slate-500">Auditoría de acreditaciones para esta función ({eventTickets.length} registros)</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setTicketFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${ticketFilter === "ALL" ? "bg-white font-medium shadow-2xs text-slate-900" : "text-slate-600"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setTicketFilter("CHECKED_IN")}
              className={`px-2.5 py-1 rounded-md transition-colors ${ticketFilter === "CHECKED_IN" ? "bg-white font-medium shadow-2xs text-emerald-800" : "text-slate-600"}`}
            >
              En Sala ({store.tickets.filter((t) => t.eventId === currentEvent.id && t.checkedIn).length})
            </button>
            <button
              onClick={() => setTicketFilter("PENDING")}
              className={`px-2.5 py-1 rounded-md transition-colors ${ticketFilter === "PENDING" ? "bg-white font-medium shadow-2xs text-amber-800" : "text-slate-600"}`}
            >
              Pendientes ({store.tickets.filter((t) => t.eventId === currentEvent.id && !t.checkedIn).length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Espectador</th>
                <th className="p-3">Cédula</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Estado de Ingreso</th>
                <th className="p-3 rounded-r-lg text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {eventTickets.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-medium text-slate-900">{tkt.citizenName}</td>
                  <td className="p-3 font-mono">{tkt.citizenId}</td>
                  <td className="p-3 font-medium">{tkt.seatLabel || (tkt.zone === "PLANTA_BAJA" ? "Platea" : "Balcón")}</td>
                  <td className="p-3">
                    {tkt.isVipGuest ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">VIP Protocolo</span>
                    ) : (
                      <span className="text-slate-500">General</span>
                    )}
                  </td>
                  <td className="p-3">
                    {tkt.checkedIn ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> En Sala ({tkt.checkedInAt ? new Date(tkt.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!tkt.checkedIn && (
                      <button
                        onClick={() => store.checkInTicket(tkt.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px] transition-colors"
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
