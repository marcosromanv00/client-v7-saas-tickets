import { useState } from "react";
import { Lock, LogIn, Sliders, RotateCcw, Shield, Users, History, LayoutGrid } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { CapacityMonitor } from "./CapacityMonitor";
import { SpecialGuestsManager } from "./SpecialGuestsManager";
import { TicketsTable } from "./TicketsTable";
import { EventConfigModal } from "./EventConfigModal";
import { AdminUserManagement } from "../auth/AdminUserManagement";
import { AuditLogViewer } from "../auth/AuditLogViewer";
import { SeatMatrixDesigner } from "./SeatMatrixDesigner";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";
import { TheaterEvent } from "../tickets/types";

interface AdminDashboardProps {
  onOpenLoginModal: () => void;
}

export function AdminDashboard({ onOpenLoginModal }: AdminDashboardProps) {
  const store = useTheaterStore();
  const { currentUser, isSuperAdmin, isProducer, isStaff } = useAuthStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [subTab, setSubTab] = useState<"aforo" | "matriz" | "admins" | "auditoria">("aforo");

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const capacity = computeDynamicCapacity(currentEvent, store.tickets, store.specialGuests, eventSeats);

  const hasAdminAccess = isSuperAdmin || isProducer || isStaff;

  const handleSaveEvent = (updated: TheaterEvent) => {
    store.updateEvent(updated);
  };

  if (!hasAdminAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-[#004ea2]/10 dark:bg-blue-500/10 border border-[#004ea2]/20 dark:border-blue-500/20 inline-block text-[#004ea2] dark:text-blue-400">
          <Lock className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Consola de Control Reservada</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Esta sección requiere privilegios de Producción General, Superadministrador o Personal de Puerta del Teatro Municipal de Alajuela.
        </p>
        <button
          onClick={onOpenLoginModal}
          className="px-6 py-3 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-2xl text-sm inline-flex items-center gap-2 shadow-md shadow-red-900/20 transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4" /> Iniciar Sesión Administrativa
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-7 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Barra Superior con Pestañas de Navegación Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-[#1e355b] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#004ea2] dark:text-blue-400 tracking-widest font-semibold">Capa Interna • Producción & Protocolo</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fdf2f4] dark:bg-red-950/50 text-[#c8102e] dark:text-red-400 font-mono font-semibold border border-[#c8102e]/20">
              {currentUser?.name}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">Consola de Control Integral</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tabs */}
          <div className="flex bg-slate-100 dark:bg-[#071324] p-1 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-xs">
            <button
              onClick={() => setSubTab("aforo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${subTab === "aforo" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <Shield className="w-3.5 h-3.5" /> Aforo
            </button>
            <button
              onClick={() => setSubTab("matriz")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${subTab === "matriz" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Matriz Sala
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setSubTab("admins")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${subTab === "admins" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <Users className="w-3.5 h-3.5" /> Admins
              </button>
            )}
            {(isSuperAdmin || isProducer) && (
              <button
                onClick={() => setSubTab("auditoria")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${subTab === "auditoria" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <History className="w-3.5 h-3.5" /> Auditoría
              </button>
            )}
          </div>

          {(subTab === "aforo" || subTab === "matriz") && (
            <>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-mono text-slate-800 dark:text-white focus:outline-none"
              >
                {store.events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.time} hrs)
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsConfigOpen(true)}
                className="px-3.5 py-1.5 bg-[#004ea2] hover:bg-[#003c80] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" /> Configurar
              </button>
            </>
          )}

          <button
            onClick={() => store.resetStore()}
            title="Reiniciar a datos iniciales de fábrica"
            className="p-2 border border-slate-200 dark:border-[#1a3357] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-50 dark:bg-[#071324] transition-colors cursor-pointer"
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

      {subTab === "matriz" && (
        <SeatMatrixDesigner
          event={currentEvent}
          currentSeats={eventSeats}
          onSaveSeats={(newSeats) => {
            store.updateEventSeats(currentEvent.id, newSeats);
            const pb = newSeats.filter((s) => s.zone === "PLANTA_BAJA").length;
            const bal = newSeats.filter((s) => s.zone === "BALCON").length;
            store.updateEvent({
              ...currentEvent,
              totalCapacity: newSeats.length,
              plantaBajaCapacity: pb,
              balconCapacity: bal,
            });
          }}
        />
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
