import { DynamicCapacityReport } from "../tickets/capacity-calculator";
import { Users, UserCheck, Armchair, AlertCircle } from "lucide-react";

interface CapacityMonitorProps {
  capacity: DynamicCapacityReport;
  eventTitle: string;
}

export function CapacityMonitor({ capacity, eventTitle }: CapacityMonitorProps) {
  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-serif text-base text-white font-medium">Monitor de Aforo Dinámico en Vivo</h3>
          <p className="text-xs text-slate-400 mt-0.5">{eventTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
          <span className="text-xs font-mono text-slate-300">Sincronización en tiempo real</span>
        </div>
      </div>

      {/* 4 Métricas Clave Contrastadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-amber-400" /> Capacidad Total
          </span>
          <p className="text-2xl font-serif font-medium text-white mt-1">{capacity.totalCapacity}</p>
          <span className="text-[10px] text-slate-500 font-mono">120 Platea • 70 Balcón</span>
        </div>

        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
          <span className="text-xs text-indigo-400 font-mono flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Pre-Reservas
          </span>
          <p className="text-2xl font-serif font-medium text-indigo-300 mt-1">{capacity.preReservedCount}</p>
          <span className="text-[10px] text-indigo-400/80 font-mono">
            {capacity.percentageOccupied}% del aforo
          </span>
        </div>

        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> En Sala (Check-In)
          </span>
          <p className="text-2xl font-serif font-medium text-emerald-300 mt-1">{capacity.checkedInCount}</p>
          <span className="text-[10px] text-emerald-400/80 font-mono">Espectadores sentados</span>
        </div>

        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
          <span className="text-xs text-amber-400 font-mono flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Walk-In Disponible
          </span>
          <p className="text-2xl font-serif font-medium text-amber-300 mt-1">{capacity.availableRemaining}</p>
          <span className="text-[10px] text-amber-400/80 font-mono">Orden de llegada</span>
        </div>
      </div>

      {/* Barra de Progreso Contrastada: Pre-Reservas vs En Sala */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Ocupación Física vs Reservas Previas:</span>
          <span className="font-mono text-slate-200 font-medium">
            {capacity.checkedInCount} en sala / {capacity.preReservedCount} pre-reservas / {capacity.totalCapacity} total
          </span>
        </div>

        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex border border-slate-800">
          {/* Segmento 1: Ya ingresados en sala */}
          <div
            className="bg-emerald-400 h-full transition-all duration-300 shadow-sm shadow-emerald-400/40"
            style={{ width: `${(capacity.checkedInCount / capacity.totalCapacity) * 100}%` }}
            title={`Ingresados: ${capacity.checkedInCount}`}
          />
          {/* Segmento 2: Reservados pero aún no han ingresado */}
          <div
            className="bg-amber-500 h-full transition-all duration-300 shadow-sm shadow-amber-500/40"
            style={{
              width: `${
                (Math.max(0, capacity.preReservedCount - capacity.checkedInCount) / capacity.totalCapacity) * 100
              }%`,
            }}
            title={`Por ingresar: ${capacity.preReservedCount - capacity.checkedInCount}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Ingresados
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pre-reservas pendientes
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Libres en taquilla
            </span>
          </div>
          <span className="font-mono text-amber-400">VIP Protocolo: {capacity.vipReservedCount}</span>
        </div>
      </div>
    </div>
  );
}
