import { useState } from "react";
import { Sliders, RotateCcw, Shield, History, Users, Lock, LogIn } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { CapacityMonitor } from "./CapacityMonitor";
import { SpecialGuestsManager } from "./SpecialGuestsManager";
import { EventConfigModal } from "./EventConfigModal";
import { TicketsTable } from "./TicketsTable";
import { AdminUserManagement } from "../auth/AdminUserManagement";
import { AuditLogViewer } from "../auth/AuditLogViewer";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { TheaterEvent } from "../tickets/types";

interface AdminDashboardProps {
  onOpenLoginModal?: () => void;
}

export function AdminDashboard({ onOpenLoginModal }: AdminDashboardProps) {
  const store = useTheaterStore();
  const { currentUser, isSuperAdmin, isProducer, isStaff } = useAuthStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [subTab, setSubTab] = useState<"aforo" | "admins" | "auditoria">("aforo");

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const capacity = computeDynamicCapacity(currentEvent, store.tickets, store.specialGuests, eventSeats);

  const handleSaveEvent = (updated: TheaterEvent) => {
    store.updateEvent(updated);
  };

  const hasAdminAccess = isSuperAdmin || isProducer || isStaff;

  if (!hasAdminAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 inline-block text-amber-400">
          <Lock className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">Consola de Control Reservada</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Esta sección requiere privilegios de Producción General, Superadministrador o Personal de Puerta.
        </p>
        <button
          onClick={onOpenLoginModal}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <LogIn className="w-4 h-4" /> Iniciar Sesión Administrativa
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-7 text-slate-100">
      {/* Barra Superior con Pestañas de Navegación Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1626]/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest">Capa Interna • Productora & Protocolo</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              {currentUser?.name}
            </span>
          </div>
          <h1 className="text-xl font-serif text-white font-medium mt-0.5">Consola de Control Integral</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tabs */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setSubTab("aforo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${subTab === "aforo" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Shield className="w-3.5 h-3.5" /> Aforo
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setSubTab("admins")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${subTab === "admins" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                <Users className="w-3.5 h-3.5" /> Admins
              </button>
            )}
            {(isSuperAdmin || isProducer) && (
              <button
                onClick={() => setSubTab("auditoria")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${subTab === "auditoria" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                <History className="w-3.5 h-3.5" /> Auditoría
              </button>
            )}
          </div>

          {subTab === "aforo" && (
            <>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none"
              >
                {store.events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.time} hrs)
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsConfigOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" /> Configurar
              </button>
            </>
          )}

          <button
            onClick={() => store.resetStore()}
            title="Reiniciar a datos iniciales de fábrica"
            className="p-1.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl bg-slate-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {subTab === "aforo" && (
        <>
          <CapacityMonitor capacity={capacity} eventTitle={currentEvent.title} />
          <SpecialGuestsManager event={currentEvent} />
          <TicketsTable tickets={store.tickets} currentEvent={currentEvent} onCheckIn={store.checkInTicket} />
        </>
      )}

      {subTab === "admins" && <AdminUserManagement />}

      {subTab === "auditoria" && <AuditLogViewer />}

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
