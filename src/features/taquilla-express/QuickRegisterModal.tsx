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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#111827] rounded-3xl shadow-2xl max-w-md w-full border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        <div className="px-6 py-4 bg-[#162032] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-medium text-white">Registro Express en Puerta</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-slate-300">
            <p className="font-medium text-white">{event.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Emisión inmediata por orden de llegada con check-in automático.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 text-rose-300 rounded-xl border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-mono text-slate-300 mb-1">Nombre Completo del Asistente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carmen Mora Rojas"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-slate-300 mb-1">Cédula o Documento de Identidad</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Ej: 1-0987-0654"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-slate-300 mb-1.5">Zona Asignada</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setZone("PLANTA_BAJA")}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  zone === "PLANTA_BAJA"
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Platea (Planta Baja)
              </button>
              <button
                type="button"
                onClick={() => setZone("BALCON")}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  zone === "BALCON"
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
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
              className="px-4 py-2 text-slate-400 hover:text-white font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-colors"
            >
              Emitir e Ingresar Ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
