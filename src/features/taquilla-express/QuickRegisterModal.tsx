import React, { useState } from "react";
import { X, UserCheck, AlertCircle } from "lucide-react";
import { ZoneId, TheaterEvent } from "../tickets/types";

interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TheaterEvent;
  onRegister: (data: { citizenName: string; citizenId: string; zone: ZoneId }) => { success: boolean; error?: string };
}

export function QuickRegisterModal({ isOpen, onClose, event, onRegister }: QuickRegisterModalProps) {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [zone, setZone] = useState<ZoneId>("PLANTA_BAJA");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !idNumber.trim()) {
      setError("Por favor complete nombre y cédula.");
      return;
    }
    const res = onRegister({ citizenName: name, citizenId: idNumber, zone });
    if (!res.success) {
      setError(res.error || "Error al emitir tiquete.");
    } else {
      setName("");
      setIdNumber("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-teatro-navy-border overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teatro-blue dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Registro Express en Puerta</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-[#071324] p-3 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Emisión inmediata por orden de llegada con check-in automático.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Nombre Completo del Asistente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carmen Mora Rojas"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue dark:focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cédula o Documento de Identidad</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Ej: 1-0987-0654"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue dark:focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">Zona Asignada</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setZone("PLANTA_BAJA")}
                className={`py-2.5 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  zone === "PLANTA_BAJA"
                    ? "bg-teatro-blue text-white border-teatro-blue-hover shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Platea (Planta Baja)
              </button>
              <button
                type="button"
                onClick={() => setZone("BALCON")}
                className={`py-2.5 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  zone === "BALCON"
                    ? "bg-teatro-blue text-white border-teatro-blue-hover shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Balcón (2da Planta)
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl shadow-md shadow-red-900/20 transition-colors cursor-pointer"
            >
              Emitir e Ingresar Ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
