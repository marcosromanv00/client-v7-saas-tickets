import { DynamicCapacityReport } from "../tickets/capacity-calculator";
import { Users, UserCheck, Armchair, AlertCircle } from "lucide-react";

interface CapacityMonitorProps {
  capacity: DynamicCapacityReport;
  eventTitle: string;
}

export function CapacityMonitor({ capacity, eventTitle }: CapacityMonitorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-serif text-base text-[#1b2a4a] font-medium">Monitor de Aforo Dinámico en Vivo</h3>
          <p className="text-xs text-slate-500 mt-0.5">{eventTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-600">Sincronización en tiempo real</span>
        </div>
      </div>

      {/* 4 Métricas Clave Contrastadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-slate-400" /> Aforo Máximo Sala
          </span>
          <p className="text-2xl font-serif font-medium text-slate-900 mt-1">{capacity.totalCapacity}</p>
          <span className="text-[11px] text-slate-400">120 Platea • 70 Balcón</span>
        </div>

        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
          <span className="text-xs text-indigo-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Pre-Reservas Emitidas
          </span>
          <p className="text-2xl font-serif font-medium text-indigo-950 mt-1">{capacity.preReservedCount}</p>
          <span className="text-[11px] text-indigo-600 font-mono">
            {capacity.percentageOccupied}% del aforo comprometido
          </span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
          <span className="text-xs text-emerald-700 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Ingresos en Sala (Check-In)
          </span>
          <p className="text-2xl font-serif font-medium text-emerald-900 mt-1">{capacity.checkedInCount}</p>
          <span className="text-[11px] text-emerald-600">Espectadores sentados</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
          <span className="text-xs text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Remanente en Puerta (Walk-ins)
          </span>
          <p className="text-2xl font-serif font-medium text-amber-950 mt-1">{capacity.availableRemaining}</p>
          <span className="text-[11px] text-amber-700">Disponibles por orden llegada</span>
        </div>
      </div>

      {/* Barra de Progreso Contrastada: Pre-Reservas vs En Sala */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Ocupación Física vs Reservas Previas:</span>
          <span className="font-mono text-slate-800 font-medium">
            {capacity.checkedInCount} ingresados / {capacity.preReservedCount} reservados / {capacity.totalCapacity} total
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
          {/* Segmento 1: Ya ingresados en sala */}
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(capacity.checkedInCount / capacity.totalCapacity) * 100}%` }}
            title={`Ingresados: ${capacity.checkedInCount}`}
          />
          {/* Segmento 2: Reservados pero aún no han ingresado */}
          <div
            className="bg-[#1b2a4a] h-full transition-all duration-300"
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
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Ingresados
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#1b2a4a]" /> Reservados pendientes
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" /> Butacas libres en taquilla
            </span>
          </div>
          <span>Protocolo VIP reservados: {capacity.vipReservedCount}</span>
        </div>
      </div>
    </div>
  );
}
