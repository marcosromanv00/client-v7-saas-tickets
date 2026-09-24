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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> Crítico
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Alerta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Registro de Auditoría Forense</h3>
            <p className="text-xs text-zinc-400">Trazabilidad inmutable de accesos, tiquetería y cambios de configuración</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar actor o acción..."
              className="bg-zinc-950/80 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">Todo</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Alertas</option>
            <option value="CRITICAL">Críticos</option>
          </select>
          <button
            onClick={exportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 border-b border-zinc-800 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="py-2.5 px-4 font-medium">Hora</th>
                <th className="py-2.5 px-4 font-medium">Actor</th>
                <th className="py-2.5 px-4 font-medium">Acción</th>
                <th className="py-2.5 px-4 font-medium">Detalles</th>
                <th className="py-2.5 px-4 font-medium text-center">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No se encontraron registros de auditoría con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLogEntry) => {
                  const date = new Date(log.timestamp);
                  const timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const dateFormatted = date.toLocaleDateString([], { month: "short", day: "numeric" });

                  return (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 px-4 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                        <div>{timeFormatted}</div>
                        <div className="text-[10px] text-zinc-600">{dateFormatted}</div>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-white">{log.actorName}</div>
                        <div className="text-[10px] text-zinc-500">{log.actorRole}</div>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/60">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-zinc-300 max-w-md">
                        <div className="line-clamp-2">{log.details}</div>
                        {log.targetEntity && (
                          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Ref: {log.targetEntity}</div>
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
