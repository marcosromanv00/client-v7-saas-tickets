import { DynamicCapacityReport } from "../tickets/capacity-calculator";
import { Users, UserCheck, Armchair, AlertCircle } from "lucide-react";

interface CapacityMonitorProps {
  capacity: DynamicCapacityReport;
  eventTitle: string;
}

export function CapacityMonitor({ capacity, eventTitle }: CapacityMonitorProps) {
  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-6 shadow-sm space-y-6 text-left transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-teatro-navy-border pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Monitor de Aforo Dinámico en Vivo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{eventTitle} • Teatro Municipal de Alajuela</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Sincronización en tiempo real</span>
        </div>
      </div>

      {/* 4 Métricas Clave Contrastadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-[#071324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1a3357] shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" /> Capacidad Total
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{capacity.totalCapacity}</p>
          <span className="text-[10px] text-slate-400 font-mono">120 Platea • 70 Balcón</span>
        </div>

        <div className="bg-slate-50 dark:bg-[#071324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1a3357] shadow-xs">
          <span className="text-xs text-teatro-blue dark:text-blue-400 font-mono flex items-center gap-1.5 font-semibold">
            <Users className="w-3.5 h-3.5" /> Pre-Reservas
          </span>
          <p className="text-2xl font-bold font-mono text-teatro-blue dark:text-blue-400 mt-1">{capacity.preReservedCount}</p>
          <span className="text-[10px] text-teatro-blue/80 dark:text-blue-400/80 font-mono">
            {capacity.percentageOccupied}% del aforo
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-[#071324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1a3357] shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 font-semibold">
            <UserCheck className="w-3.5 h-3.5" /> En Sala (Check-In)
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{capacity.checkedInCount}</p>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">Espectadores sentados</span>
        </div>

        <div className="bg-slate-50 dark:bg-[#071324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1a3357] shadow-xs">
          <span className="text-xs text-teatro-gold dark:text-amber-400 font-mono flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> Walk-In Disponible
          </span>
          <p className="text-2xl font-bold font-mono text-teatro-gold dark:text-amber-400 mt-1">{capacity.availableRemaining}</p>
          <span className="text-[10px] text-teatro-gold/80 dark:text-amber-400/80 font-mono">Orden de llegada</span>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">Ocupación Física vs Reservas Previas:</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
            {capacity.checkedInCount} en sala / {capacity.preReservedCount} pre-reservas / {capacity.totalCapacity} total
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-[#071324] h-3 rounded-full overflow-hidden flex border border-slate-200 dark:border-[#1a3357]">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(capacity.checkedInCount / capacity.totalCapacity) * 100}%` }}
            title={`Ingresados: ${capacity.checkedInCount}`}
          />
          <div
            className="bg-teatro-blue dark:bg-blue-500 h-full transition-all duration-300"
            style={{
              width: `${
                (Math.max(0, capacity.preReservedCount - capacity.checkedInCount) / capacity.totalCapacity) * 100
              }%`,
            }}
            title={`Por ingresar: ${capacity.preReservedCount - capacity.checkedInCount}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ingresados
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teatro-blue dark:bg-blue-500" /> Pre-reservas
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Libres
            </span>
          </div>
          <span className="font-mono text-teatro-gold dark:text-amber-400 font-semibold">VIP Protocolo: {capacity.vipReservedCount}</span>
        </div>
      </div>
    </div>
  );
}
