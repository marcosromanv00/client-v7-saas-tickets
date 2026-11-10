import React, { useState, useEffect, useMemo } from "react";
import { X, BarChart3, Search, RefreshCw } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { fetchAllAttendanceCountersFromSupabase } from "../tickets/supabase-attendance-service";

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: TheaterEvent[];
  onSelectEvent?: (eventId: string) => void;
}

export const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
  events,
  onSelectEvent,
}) => {
  const store = useTheaterStore();
  const [remoteCounters, setRemoteCounters] = useState<Record<string, { deliveredCount: number; totalCapacity: number }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllAttendanceCountersFromSupabase();
      const map: Record<string, { deliveredCount: number; totalCapacity: number }> = {};
      data.forEach((row) => {
        map[row.event_id] = {
          deliveredCount: row.delivered_count,
          totalCapacity: row.total_capacity || 225,
        };
      });
      setRemoteCounters(map);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const reportItems = useMemo(() => {
    return events.map((evt) => {
      const local = store.braceletCountersByEvent?.[evt.id]?.deliveredCount;
      const remote = remoteCounters[evt.id]?.deliveredCount;
      const delivered = typeof remote === "number" ? remote : (typeof local === "number" ? local : 0);
      const cap = evt.totalCapacity || 225;
      const diff = cap < 225 ? 225 - cap : 0;
      const adjusted = delivered + diff;
      const pct = Math.min(100, Math.round((adjusted / 225) * 100));

      return {
        event: evt,
        delivered,
        capacity: cap,
        diff,
        adjusted,
        percentage: pct,
      };
    });
  }, [events, remoteCounters, store.braceletCountersByEvent]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return reportItems;
    const q = searchTerm.toLowerCase();
    return reportItems.filter(
      (item) =>
        item.event.title.toLowerCase().includes(q) ||
        item.event.date.includes(q) ||
        (item.event.genre && item.event.genre.toLowerCase().includes(q))
    );
  }, [reportItems, searchTerm]);

  const totals = useMemo(() => {
    const totalDelivered = reportItems.reduce((acc, i) => acc + i.delivered, 0);
    const totalAdjusted = reportItems.reduce((acc, i) => acc + i.adjusted, 0);
    const totalMax = reportItems.length * 225;
    return { totalDelivered, totalAdjusted, totalMax };
  }, [reportItems]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#071324]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teatro-blue/10 dark:bg-teatro-blue/20 text-teatro-blue dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Reporte Consolidado de Asistencia y Brazaletes
              </h2>
              <p className="text-3xs font-mono text-slate-400">
                Historial auditado de todas las funciones del Teatro Municipal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-teatro-blue" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resumen Superior */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-slate-50 dark:bg-[#071324] border-b border-slate-200/80 dark:border-[#142844] text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b1a30] border border-slate-200/80 dark:border-[#142844] shadow-2xs">
            <span className="text-3xs font-mono text-slate-400 uppercase block font-semibold">Funciones</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
              {reportItems.length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b1a30] border border-slate-200/80 dark:border-[#142844] shadow-2xs">
            <span className="text-3xs font-mono text-slate-400 uppercase block font-semibold">Registradas DB</span>
            <span className="text-base font-extrabold text-teatro-blue dark:text-blue-400 font-mono">
              {totals.totalDelivered.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 shadow-2xs">
            <span className="text-3xs font-mono text-emerald-700 dark:text-emerald-400 uppercase block font-semibold">Total Final (225)</span>
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
              {totals.totalAdjusted.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buscador */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, fecha o género..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200/80 dark:border-[#1a3357] rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-teatro-blue"
            />
          </div>
        </div>

        {/* Lista de Funciones */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredItems.map((item) => (
            <div
              key={item.event.id}
              className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 ring-1 ring-black/10"
                    style={{ backgroundColor: item.event.braceletColorHex || "#ffffff" }}
                  />
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                    {item.event.title}
                  </h4>
                  {onSelectEvent && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectEvent(item.event.id);
                        onClose();
                      }}
                      className="px-2 py-0.5 text-3xs font-mono font-semibold rounded bg-teatro-blue/10 text-teatro-blue dark:text-blue-400 hover:bg-teatro-blue hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      Ver en taquilla
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-3xs text-slate-400 font-mono">
                  <span>{item.event.date} • {item.event.time}</span>
                  <span>•</span>
                  <span>Aforo: {item.capacity}</span>
                  {item.diff > 0 && <span className="text-amber-500 font-semibold">(+{item.diff} ajuste 225)</span>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                  {item.adjusted} <span className="text-3xs text-slate-400 font-normal">/ 225</span>
                </div>
                <div className="text-3xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {item.percentage}% ocupación
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
