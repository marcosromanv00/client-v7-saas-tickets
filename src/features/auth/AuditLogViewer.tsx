import React, { useState } from "react";
import { useAuditLogs } from "./useAuditLogs";
import { AuditLogEntry, AuditSeverity } from "./types";
import { History, Download, Search, AlertTriangle, Info } from "lucide-react";

export const AuditLogViewer: React.FC = () => {
  const { logs } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((log: AuditLogEntry) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `audit-trail-${new Date().toISOString().slice(0, 10)}.json`);
    a.click();
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
            <AlertTriangle className="w-3 h-3" /> Crítico
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
            <AlertTriangle className="w-3 h-3" /> Alerta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-teatro-blue dark:text-sky-300 border border-sky-200 dark:border-sky-800/50">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0b1a30] p-4 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-teatro-blue dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm">Registro de Auditoría Forense</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Trazabilidad inmutable de accesos, tiquetería y cambios de configuración</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar actor o acción..."
              className="bg-slate-50 dark:bg-teatro-navy border border-slate-200 dark:border-teatro-navy-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teatro-blue"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-teatro-navy border border-slate-200 dark:border-teatro-navy-border rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-teatro-blue"
          >
            <option value="ALL">Todo</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Alertas</option>
            <option value="CRITICAL">Críticos</option>
          </select>
          <button
            onClick={exportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-teatro-navy-border dark:hover:bg-[#254270] text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-[#2d4d82] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-125">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-teatro-navy text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-teatro-navy-border sticky top-0">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Hora</th>
                <th className="py-2.5 px-4 font-semibold">Actor</th>
                <th className="py-2.5 px-4 font-semibold">Acción</th>
                <th className="py-2.5 px-4 font-semibold">Detalles</th>
                <th className="py-2.5 px-4 font-semibold text-center">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-teatro-navy-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No se encontraron registros de auditoría con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLogEntry) => {
                  const date = new Date(log.timestamp);
                  const timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const dateFormatted = date.toLocaleDateString([], { month: "short", day: "numeric" });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-teatro-navy-border/30 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        <div>{timeFormatted}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{dateFormatted}</div>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-white">{log.actorName}</div>
                        <div className="text-[10px] text-slate-500">{log.actorRole}</div>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-teatro-navy text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-teatro-navy-border">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                        <div className="line-clamp-2">{log.details}</div>
                        {log.targetEntity && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">Ref: {log.targetEntity}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        {getSeverityBadge(log.severity)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
