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
    <div className="bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-[#1e355b] shadow-sm transition-colors">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <label htmlFor="citizen-id-search" className="sr-only">Número de Cédula o Identificación</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="citizen-id-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese cédula o documento (ej: 1-1120-0456)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2] dark:focus:border-blue-500 text-sm transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || searchTerm.trim().length < 4}
          className="w-full sm:w-auto px-6 py-3 bg-[#004ea2] hover:bg-[#003c80] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Buscar Tiquete</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuickRegister}
          className="w-full sm:w-auto px-5 py-3 bg-[#fdf2f4] dark:bg-red-950/40 hover:bg-[#fae1e5] dark:hover:bg-red-900/50 text-[#c8102e] dark:text-red-300 border border-[#c8102e]/30 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registro Express Walk-In</span>
        </button>
      </form>
      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-left">
        Búsqueda por cédula para validación de sala. Para ciudadanos sin reserva previa, utilice el botón &ldquo;Registro Express Walk-In&rdquo;.
      </p>
    </div>
  );
}
