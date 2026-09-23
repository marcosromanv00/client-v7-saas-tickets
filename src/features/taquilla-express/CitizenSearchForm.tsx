import React, { useState } from "react";
import { Search, UserPlus } from "lucide-react";

interface CitizenSearchFormProps {
  onSearch: (id: string) => void;
  onOpenQuickRegister: () => void;
  isLoading?: boolean;
}

export function CitizenSearchForm({ onSearch, onOpenQuickRegister, isLoading = false }: CitizenSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 4) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <label htmlFor="citizen-id-search" className="sr-only">Número de Cédula o Identificación</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="citizen-id-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese cédula o documento (ej: 1-1120-0456)..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || searchTerm.trim().length < 4}
          className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Buscar Tiquete</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuickRegister}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 rounded-2xl font-medium text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registro Express Walk-In</span>
        </button>
      </form>
      <p className="mt-3 text-[11px] text-slate-400 text-left">
        Búsqueda por cédula para validación de sala. Para ciudadanos sin reserva previa, utilice el botón &ldquo;Registro Express Walk-In&rdquo;.
      </p>
    </div>
  );
}
