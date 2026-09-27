import React from "react";
import { ArrowRight } from "lucide-react";
import { StaffTimeEntry } from "../staff/types";
import { formatMinutesToHours } from "../staff/staff-time-store";

interface StandaloneTimeLogsListProps {
  entries: StaffTimeEntry[];
  onClockOut: (entryId: string) => void;
}

export const StandaloneTimeLogsList: React.FC<StandaloneTimeLogsListProps> = ({
  entries,
  onClockOut,
}) => {
  if (entries.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        Marcajes Registrados Recientemente
      </h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{entry.staffName}</span>
                <span className="font-mono text-[10px] text-slate-400">({entry.staffCitizenId})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {entry.assignedDuty} • Entrada: {new Date(entry.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {entry.clockOut && ` - Salida: ${new Date(entry.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </p>
            </div>
            {!entry.clockOut ? (
              <button
                type="button"
                onClick={() => onClockOut(entry.id)}
                className="px-3 py-2 rounded-xl bg-muni-red hover:bg-muni-red-hover text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Marcar Salida</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
                {entry.totalMinutes ? formatMinutesToHours(entry.totalMinutes) : "Completado"}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
