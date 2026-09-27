import React, { useState } from "react";
import { StaffTimeEntry, StaffDutyInfo } from "./types";
import { formatMinutesToHours } from "./staff-time-store";
import { Clock, Filter } from "lucide-react";

interface StaffTimeLogsTableProps {
  entries: StaffTimeEntry[];
}

export const StaffTimeLogsTable: React.FC<StaffTimeLogsTableProps> = ({ entries }) => {
  const [filterDuty, setFilterDuty] = useState<string>("ALL");

  const filtered = entries.filter((e) => {
    if (filterDuty !== "ALL" && e.assignedDuty !== filterDuty) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-2xl overflow-hidden shadow-xs space-y-3">
      <div className="p-4 border-b border-slate-200 dark:border-teatro-navy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Bitácora de Horas Laboradas por el Personal ({filtered.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterDuty}
            onChange={(e) => setFilterDuty(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="ALL">Todos los puestos</option>
            <option value="PUERTA">Puerta</option>
            <option value="TAQUILLA">Taquilla</option>
            <option value="SALA">Sala</option>
            <option value="INCIDENCIAS">Incidencias</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#071324] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-4 font-medium">Colaborador</th>
              <th className="py-2.5 px-4 font-medium">Cédula</th>
              <th className="py-2.5 px-4 font-medium">Función Teatral</th>
              <th className="py-2.5 px-4 font-medium">Puesto</th>
              <th className="py-2.5 px-4 font-medium">Entrada</th>
              <th className="py-2.5 px-4 font-medium">Salida</th>
              <th className="py-2.5 px-4 font-medium text-right">Tiempo Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                  No hay registros de jornada que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              filtered.map((e) => {
                const meta = StaffDutyInfo[e.assignedDuty] || StaffDutyInfo.GENERAL;
                return (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{e.staffName}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{e.staffCitizenId}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 truncate max-w-44">{e.eventTitle}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badgeClass}`}>
                        {meta.shortName}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(e.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                      {e.clockOut ? (
                        new Date(e.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      ) : (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En curso
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-teatro-blue dark:text-blue-400">
                      {e.totalMinutes !== undefined ? formatMinutesToHours(e.totalMinutes) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
