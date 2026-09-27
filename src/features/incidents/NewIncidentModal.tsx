import React, { useState } from "react";
import { AlertCircle, X, AlertTriangle } from "lucide-react";
import { useIncidentStore } from "./useIncidentStore";
import { IncidentCategory, IncidentSeverity, IncidentCategoryLabels } from "./types";
import { TheaterEvent } from "../tickets/types";
import { useAuthStore } from "../auth/useAuthStore";

interface NewIncidentModalProps {
  isOpen: boolean;
  currentEvent: TheaterEvent;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  currentEvent,
  onClose,
  onCreated,
}) => {
  const { createIncident } = useIncidentStore();
  const { currentUser } = useAuthStore();

  const [category, setCategory] = useState<IncidentCategory>("ASIENTO_DUPLICADO");
  const [severity, setSeverity] = useState<IncidentSeverity>("MEDIA");
  const [locationZone, setLocationZone] = useState("Platea Baja");
  const [seatOrArea, setSeatOrArea] = useState("");
  const [affectedPersonName, setAffectedPersonName] = useState("");
  const [affectedPersonId, setAffectedPersonId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim() || description.trim().length < 5) {
      setError("Por favor detalle la descripción de la incidencia (mínimo 5 caracteres).");
      return;
    }

    const inc = createIncident({
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      category,
      severity,
      locationZone,
      seatOrArea: seatOrArea.trim() || undefined,
      affectedPersonName: affectedPersonName.trim() || undefined,
      affectedPersonId: affectedPersonId.trim() || undefined,
      description: description.trim(),
      reportedBy: currentUser?.name || "Personal de Turno",
      reportedByRole: currentUser?.role || "DELEGATED_ADMIN",
    });

    onCreated(inc.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reportar Nueva Incidencia</h3>
              <p className="text-xs text-slate-500 font-mono">Función: {currentEvent.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {Object.entries(IncidentCategoryLabels).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Severidad</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer font-semibold"
              >
                <option value="BAJA">🟢 Baja (Leve)</option>
                <option value="MEDIA">🟡 Media (Requiere atención)</option>
                <option value="ALTA">🟠 Alta (Atención prioritaria)</option>
                <option value="CRITICA">🔴 Crítica (Urgencia inmediata)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Zona / Área *</label>
              <select
                value={locationZone}
                onChange={(e) => setLocationZone(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="Platea Baja">Platea Baja</option>
                <option value="Nivel Medio">Nivel Medio</option>
                <option value="Balcón Superior">Balcón Superior</option>
                <option value="Puerta Principal">Puerta Principal</option>
                <option value="Taquilla Express">Taquilla Express</option>
                <option value="Lobby / Pasillo">Lobby / Pasillo</option>
                <option value="Escenario / Camerinos">Escenario / Camerinos</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Butaca o Lugar Específico</label>
              <input
                type="text"
                value={seatOrArea}
                onChange={(e) => setSeatOrArea(e.target.value)}
                placeholder="Ej. Fila C-04 o Puerta Norte"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Asistente Afectado (Opcional)</label>
              <input
                type="text"
                value={affectedPersonName}
                onChange={(e) => setAffectedPersonName(e.target.value)}
                placeholder="Nombre del espectador"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cédula del Asistente</label>
              <input
                type="text"
                value={affectedPersonId}
                onChange={(e) => setAffectedPersonId(e.target.value)}
                placeholder="Cédula si aplica"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Descripción del Hecho *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique claramente lo sucedido para que el equipo tome acción..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer">Registrar Incidencia</button>
          </div>
        </form>
      </div>
    </div>
  );
};
