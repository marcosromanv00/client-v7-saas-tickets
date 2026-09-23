import { Clock } from "lucide-react";
import { Ticket } from "../tickets/types";

interface RecentEntriesListProps {
  entries: Ticket[];
}

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-serif font-medium text-slate-800 mb-4">Últimos Ingresos Verificados en Sala</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No hay ingresos registrados todavía para esta función.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-slate-800">{entry.citizenName}</span>
                <span className="text-slate-400 font-mono ml-2">({entry.citizenId})</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>{entry.seatLabel || (entry.zone === "PLANTA_BAJA" ? "Platea" : "Balcón")}</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
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
