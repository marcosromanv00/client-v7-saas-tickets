import React, { useState, useMemo } from "react";
import { Plus, Search, CheckCircle2 } from "lucide-react";
import { useIncidentStore } from "./useIncidentStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { TheaterIncident } from "./types";
import { IncidentItemCard } from "./IncidentItemCard";
import { NewIncidentModal } from "./NewIncidentModal";
import { ResolveIncidentModal } from "./ResolveIncidentModal";
import { getDefaultActiveEventId, getUpcomingActiveEvents } from "../tickets/event-date-utils";

export const IncidentsDashboardView: React.FC = () => {
  const store = useTheaterStore();
  const { incidents, deleteIncident } = useIncidentStore();
  const { isSuperAdmin } = useAuthStore();
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);

  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [filterStatus, setFilterStatus] = useState<string>("TODAS");
  const [filterSeverity, setFilterSeverity] = useState<string>("TODAS");
  const [search, setSearch] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [resolvingIncident, setResolvingIncident] = useState<TheaterIncident | null>(null);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      if (filterStatus !== "TODAS" && i.status !== filterStatus) return false;
      if (filterSeverity !== "TODAS" && i.severity !== filterSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const inDesc = i.description.toLowerCase().includes(q);
        const inLoc = i.locationZone.toLowerCase().includes(q) || (i.seatOrArea && i.seatOrArea.toLowerCase().includes(q));
        const inPerson = i.affectedPersonName?.toLowerCase().includes(q) || i.affectedPersonId?.includes(q);
        if (!inDesc && !inLoc && !inPerson) return false;
      }
      return true;
    });
  }, [incidents, filterStatus, filterSeverity, search]);

  const openCount = incidents.filter((i) => i.status === "ABIERTA").length;
  const criticalCount = incidents.filter((i) => i.status === "ABIERTA" && (i.severity === "CRITICA" || i.severity === "ALTA")).length;
  const resolvedCount = incidents.filter((i) => i.status === "RESUELTA").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Mesa de Contingencias en Vivo
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Registro y Control de Incidencias en Sala
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bitácora operativa para acomodadores, taquilleros y equipo de protocolo.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 30 ? `${evt.title.slice(0, 28)}...` : evt.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Reportar Incidencia
          </button>
        </div>
      </div>

      {/* Métricas de Incidencias */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Registradas</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">{incidents.length}</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-xs text-center ${openCount > 0 ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" : "bg-white dark:bg-[#0b1a30] border-slate-200 dark:border-teatro-navy-border"}`}>
          <span className="text-[10px] font-mono uppercase">Abiertas / En Atención</span>
          <p className="text-2xl font-bold font-mono mt-0.5">{openCount}</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-xs text-center ${criticalCount > 0 ? "bg-red-500/15 border-red-500/40 text-muni-red dark:text-red-400 animate-pulse" : "bg-white dark:bg-[#0b1a30] border-slate-200 dark:border-teatro-navy-border"}`}>
          <span className="text-[10px] font-mono uppercase">Alta / Crítica</span>
          <p className="text-2xl font-bold font-mono mt-0.5">{criticalCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border shadow-xs text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Resueltas</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{resolvedCount}</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0b1a30] p-3.5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción, zona, butaca o asistente..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="TODAS">Todos los estados</option>
            <option value="ABIERTA">Solo Abiertas</option>
            <option value="RESUELTA">Solo Resueltas</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="TODAS">Toda severidad</option>
            <option value="CRITICA">🔴 Crítica</option>
            <option value="ALTA">🟠 Alta</option>
            <option value="MEDIA">🟡 Media</option>
            <option value="BAJA">🟢 Baja</option>
          </select>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Sin incidencias pendientes</h3>
            <p className="text-xs text-slate-400">No se encontraron reportes con los criterios de filtro aplicados.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <IncidentItemCard
              key={inc.id}
              incident={inc}
              isSuperAdmin={isSuperAdmin}
              onResolve={(target) => setResolvingIncident(target)}
              onDelete={(id) => deleteIncident(id)}
            />
          ))
        )}
      </div>

      <NewIncidentModal
        isOpen={isNewModalOpen}
        currentEvent={currentEvent}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={() => {}}
      />

      <ResolveIncidentModal
        incident={resolvingIncident}
        onClose={() => setResolvingIncident(null)}
        onResolved={() => {}}
      />
    </div>
  );
};
