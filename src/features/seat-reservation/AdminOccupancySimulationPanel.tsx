import React, { useState } from "react";
import { Sliders, Armchair, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { TheaterEvent, Seat } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { TheaterSeatMap } from "./TheaterSeatMap";
import { EventConfigModal } from "../admin/EventConfigModal";
import { computeDynamicCapacity } from "../tickets/capacity-calculator";

interface AdminOccupancySimulationPanelProps {
  event: TheaterEvent;
  seats: Seat[];
}

export const AdminOccupancySimulationPanel: React.FC<AdminOccupancySimulationPanelProps> = ({
  event,
  seats,
}) => {
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const store = useTheaterStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [inspectedSeat, setInspectedSeat] = useState<Seat | null>(null);

  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  if (!canManage) return null;

  const capacityReport = computeDynamicCapacity(event, store.tickets, store.specialGuests, seats);
  const braceletCount = store.braceletCountersByEvent?.[event.id]?.deliveredCount || 0;
  const totalCapacity = event.totalCapacity || 220;
  const inAttendance = Math.max(braceletCount, capacityReport.checkedInCount);
  const occupiedCount = Math.max(inAttendance, capacityReport.preReservedCount);
  const availableRemaining = Math.max(0, totalCapacity - occupiedCount);
  const occupancyPercent = totalCapacity > 0 ? Math.min(100, Math.round((occupiedCount / totalCapacity) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-md overflow-hidden animate-in fade-in transition-colors">
      {/* 1. Header con Badge de Permisos y Sincronización */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teatro-blue/10 dark:bg-blue-900/30 text-teatro-blue dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold block">
              Control de Sala • {isSuperAdmin ? "Superadmin" : "Administrador"}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Supervisión de Aforo y Simulación
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Supabase DB Sync
          </span>

          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teatro-blue hover:bg-teatro-blue-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Modificar color de brazalete y cantidad de butacas disponibles"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Modificar Aforo / Color</span>
          </button>
        </div>
      </div>

      {/* 2. Métricas de Aforo y Ocupación */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Ocupación Actual</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{occupancyPercent}%</span>
              <span className="text-[10px] text-slate-400">({occupiedCount}/{totalCapacity})</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPercent >= 90 ? "bg-red-500" : occupancyPercent >= 75 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Butacas Disponibles</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
              {availableRemaining} libres
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Capacidad: {totalCapacity} butacas</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">En Sala / Brazaletes</span>
            <span className="text-lg font-bold font-mono text-teatro-blue dark:text-blue-400 block mt-0.5">
              {inAttendance}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              {braceletCount > 0 ? "Brazaletes entregados" : "Boletos validados"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Brazalete Oficial</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs shrink-0"
                style={{ backgroundColor: event.braceletColorHex || "#004ea2" }}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {event.braceletColorName || "Azul Rey"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="text-[10px] text-teatro-blue dark:text-blue-400 hover:underline mt-1 block font-medium cursor-pointer"
            >
              Cambiar color
            </button>
          </div>
        </div>

        {/* 3. Control de Simulación de Sala */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSimulating
                ? "bg-slate-100 dark:bg-[#071324] border-teatro-blue text-teatro-blue dark:text-blue-400 shadow-inner"
                : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-300 hover:border-teatro-blue/40"
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>{isSimulating ? "Ocultar Simulación de Sala" : "Ver Simulación de Sala (Plano en Vivo)"}</span>
            {isSimulating ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4. Visor Interactivo de la Simulación de Sala */}
        {isSimulating && (
          <div className="mt-4 p-4 sm:p-6 bg-slate-50 dark:bg-[#071324] rounded-3xl border border-slate-200 dark:border-[#1a3357] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
                  Simulación de Butacas y Aforo en Tiempo Real
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toca cualquier butaca para inspeccionar su estado actual en sala.
                </p>
              </div>

              {inspectedSeat && (
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0b1a30] border border-teatro-blue/30 text-xs flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{inspectedSeat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inspectedSeat.status === "AVAILABLE" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}>
                    {inspectedSeat.status === "AVAILABLE" ? "Libre" : "Ocupada / Reservada"}
                  </span>
                  {inspectedSeat.isVip && (
                    <span className="text-[10px] bg-amber-400/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-semibold">
                      VIP
                    </span>
                  )}
                </div>
              )}
            </div>

            <TheaterSeatMap
              seats={seats}
              selectedSeatIds={inspectedSeat ? [inspectedSeat.id] : []}
              onToggleSeat={(s) => setInspectedSeat(inspectedSeat?.id === s.id ? null : s)}
              allowVipSelection={true}
            />
          </div>
        )}
      </div>

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={event}
        braceletColors={store.braceletColors}
        onSave={(updated) => store.updateEvent(updated)}
      />
    </div>
  );
};
