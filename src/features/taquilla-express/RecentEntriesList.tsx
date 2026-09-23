import { Clock } from "lucide-react";
import { Ticket } from "../tickets/types";

interface RecentEntriesListProps {
  entries: Ticket[];
}

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 text-left shadow-xl">
      <h3 className="text-sm font-serif font-medium text-white mb-4">Últimos Ingresos Verificados en Sala</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No hay ingresos registrados todavía para esta función.</p>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {entries.map((entry) => (
            <div key={entry.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-slate-100">{entry.citizenName}</span>
                <span className="text-slate-500 font-mono ml-2">({entry.citizenId})</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="font-mono text-amber-400">
                  {entry.seatLabel || (entry.zone === "PLANTA_BAJA" ? "Platea" : "Balcón")}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-amber-500" />
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
