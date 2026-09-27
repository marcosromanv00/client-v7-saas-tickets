import React, { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { TheaterIncident } from "./types";
import { useAuthStore } from "../auth/useAuthStore";
import { useIncidentStore } from "./useIncidentStore";

interface ResolveIncidentModalProps {
  incident: TheaterIncident | null;
  onClose: () => void;
  onResolved: () => void;
}

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  incident,
  onClose,
  onResolved,
}) => {
  const { resolveIncident } = useIncidentStore();
  const { currentUser } = useAuthStore();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || notes.trim().length < 4) {
      setError("Ingrese una breve nota sobre cómo se resolvió la situación.");
      return;
    }

    resolveIncident(
      incident.id,
      notes.trim(),
      currentUser?.name || "Superadministrador"
    );

    onResolved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Resolver Incidencia</h3>
              <p className="text-xs text-slate-500 font-mono">ID: {incident.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">{incident.description}</div>
          <div className="text-[11px] text-slate-500">
            Zona: <strong>{incident.locationZone}</strong> {incident.seatOrArea && `(${incident.seatOrArea})`}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Notas de Resolución & Solución Aplicada *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Se reubicó al espectador en Fila C-08 o se emitió nuevo brazalete tras verificación..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer">
              Marcar como Resuelta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
