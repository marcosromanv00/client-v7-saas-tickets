import React, { useRef, useEffect } from "react";
import { Search, X, UserPlus } from "lucide-react";
import { AttendeeFilterState, AttendeeStatusFilter, AttendeeSortMode } from "./attendee-types";
import { ZoneId } from "../tickets/types";

interface AttendeeFilterBarProps {
  filters: AttendeeFilterState;
  onChangeFilters: (newFilters: AttendeeFilterState) => void;
  onOpenQuickAddModal: () => void;
  totalFilteredCount: number;
}

export const AttendeeFilterBar: React.FC<AttendeeFilterBarProps> = ({
  filters,
  onChangeFilters,
  onOpenQuickAddModal,
  totalFilteredCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado: presionar '/' para enfocar buscador, 'Esc' para limpiar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        onChangeFilters({ ...filters, searchQuery: "" });
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filters, onChangeFilters]);

  const handleStatusChange = (status: AttendeeStatusFilter) => {
    onChangeFilters({ ...filters, statusFilter: status });
  };

  const handleZoneChange = (zone: ZoneId | "ALL") => {
    onChangeFilters({ ...filters, zoneFilter: zone });
  };

  const handleSortChange = (sortBy: AttendeeSortMode) => {
    onChangeFilters({ ...filters, sortBy });
  };

  return (
    <div className="space-y-2.5">
      {/* Fila Principal: Buscador Reactivo y Botón In-Situ */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Buscar por Nombre, Cédula (ej. 1-1120) o Butaca (ej. A-08)..."
            className="w-full pl-9 pr-16 py-2.5 bg-white dark:bg-[#0c1a2f] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teatro-blue shadow-2xs transition-colors"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {filters.searchQuery ? (
              <button
                onClick={() => onChangeFilters({ ...filters, searchQuery: "" })}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Limpiar búsqueda (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                /
              </span>
            )}
          </div>
        </div>

        {/* Botón Acción Rápida: Añadir In-situ */}
        <button
          onClick={onOpenQuickAddModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-teatro-blue hover:bg-teatro-blue-hover text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Registrar In-situ</span>
        </button>
      </div>

      {/* Fila Secundaria: Filtros Rápidos y Ordenamiento */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Chips de Estado */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Estado:</span>
          {(
            [
              { key: "ALL", label: "Todos" },
              { key: "PENDING", label: "Pendientes" },
              { key: "CHECKED_IN", label: "En Sala" },
              { key: "RELEASED_NO_SHOW", label: "Liberados" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => handleStatusChange(item.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filters.statusFilter === item.key
                  ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Zona y Selector de Orden */}
        <div className="flex items-center gap-2">
          {/* Selector de Zona */}
          <select
            value={filters.zoneFilter}
            onChange={(e) => handleZoneChange(e.target.value as ZoneId | "ALL")}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs border border-transparent dark:border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas las Zonas</option>
            <option value="PLATEA_BAJA">Platea Baja</option>
            <option value="NIVEL_MEDIO">Nivel Medio</option>
            <option value="BALCON_ALTO">Balcón Superior</option>
          </select>

          {/* Selector de Orden */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as AttendeeSortMode)}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs border border-transparent dark:border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="SMART_PENDING_FIRST">Orden: Pendientes primero</option>
            <option value="NAME_ASC">Orden: Alfabético (A-Z)</option>
            <option value="SEAT_ASC">Orden: Por Butaca (Fila A-Z)</option>
          </select>

          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            ({totalFilteredCount})
          </span>
        </div>
      </div>
    </div>
  );
};
