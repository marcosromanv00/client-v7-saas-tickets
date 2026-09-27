import React from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import { TheaterIncident, IncidentSeverityConfig, IncidentCategoryLabels } from "./types";

interface IncidentItemCardProps {
  incident: TheaterIncident;
  isSuperAdmin: boolean;
  onResolve: (incident: TheaterIncident) => void;
  onDelete: (id: string) => void;
}

export const IncidentItemCard: React.FC<IncidentItemCardProps> = ({
  incident,
  isSuperAdmin,
  onResolve,
  onDelete,
}) => {
  const sevMeta = IncidentSeverityConfig[incident.severity];
  const catMeta = IncidentCategoryLabels[incident.category];
  const isOpen = incident.status === "ABIERTA";

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0b1a30] border ${sevMeta.borderClass} shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}
    >
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sevMeta.badgeClass}`}>
            {sevMeta.label}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
            {catMeta?.label || incident.category}
          </span>
          <span className="text-xs font-semibold text-teatro-blue dark:text-blue-400">
            📍 {incident.locationZone} {incident.seatOrArea && `• ${incident.seatOrArea}`}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
          {incident.description}
        </p>

        <div className="text-[10px] text-slate-400 flex items-center gap-2 flex-wrap">
          <span>Reportado por: <strong>{incident.reportedBy}</strong></span>
          <span>• {new Date(incident.reportedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {incident.affectedPersonName && (
            <span className="text-slate-600 dark:text-slate-300 font-mono">
              • Asistente: {incident.affectedPersonName} {incident.affectedPersonId && `(${incident.affectedPersonId})`}
            </span>
          )}
        </div>

        {incident.resolutionNotes && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
            <strong>Solución aplicada ({incident.resolvedBy}):</strong> {incident.resolutionNotes}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isOpen ? (
          <button
            type="button"
            onClick={() => onResolve(incident)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolver
          </button>
        ) : (
          <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Resuelta
          </span>
        )}

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => onDelete(incident.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
            title="Eliminar reporte"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
