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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#1b2a4a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-medium">Registro Express en Puerta</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <p className="font-medium text-slate-800">{event.title}</p>
            <p>Emisión inmediata por orden de llegada con check-in automático.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo del Asistente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carmen Mora Rojas"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cédula o Documento de Identidad</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Ej: 1-0987-0654"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Zona Asignada</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setZone("PLANTA_BAJA")}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  zone === "PLANTA_BAJA"
                    ? "bg-[#1b2a4a] text-white border-[#1b2a4a]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Planta Baja (Platea)
              </button>
              <button
                type="button"
                onClick={() => setZone("BALCON")}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  zone === "BALCON"
                    ? "bg-[#1b2a4a] text-white border-[#1b2a4a]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Segunda Planta (Balcón)
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
            >
              Emitir e Ingresar Ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
