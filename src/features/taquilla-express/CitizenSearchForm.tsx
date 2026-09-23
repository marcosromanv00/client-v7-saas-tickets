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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <label htmlFor="citizen-id-search" className="sr-only">Número de Cédula o Identificación</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="citizen-id-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese cédula o documento (ej: 1-1120-0456)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white text-base transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || searchTerm.trim().length < 4}
          className="w-full sm:w-auto px-6 py-3 bg-[#1b2a4a] hover:bg-[#233858] disabled:bg-slate-300 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          <span>Buscar Tiquete</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuickRegister}
          className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registro Express en Puerta</span>
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">
        Búsqueda rápida para ingreso presencial. Si el ciudadano no tiene reserva previa, use el botón &ldquo;Registro Express&rdquo;.
      </p>
    </div>
  );
}
