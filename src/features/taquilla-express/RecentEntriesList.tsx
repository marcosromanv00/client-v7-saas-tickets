import { Clock } from "lucide-react";
import { Ticket } from "../tickets/types";

interface RecentEntriesListProps {
  entries: Ticket[];
}

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-6 text-left shadow-sm transition-colors">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-4">Últimos Ingresos Verificados en Sala</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No hay ingresos registrados todavía para esta función.</p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((entry) => (
            <div key={entry.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{entry.citizenName}</span>
                <span className="text-slate-400 font-mono ml-2">({entry.citizenId})</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <span className="font-mono text-teatro-blue dark:text-blue-400 font-semibold">
                  {entry.seatLabel || (entry.zone === "PLANTA_BAJA" ? "Platea" : "Balcón")}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-teatro-gold" />
                  {entry.checkedInAt ? new Date(entry.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
