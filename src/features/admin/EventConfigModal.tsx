import React, { useState } from "react";
import { X, Sliders, Save } from "lucide-react";
import { TheaterEvent, EventMode } from "../tickets/types";

interface EventConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TheaterEvent;
  onSave: (updated: TheaterEvent) => void;
}

export function EventConfigModal({ isOpen, onClose, event, onSave }: EventConfigModalProps) {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [duration, setDuration] = useState(event.durationMinutes);
  const [mode, setMode] = useState<EventMode>(event.mode);
  const [registrationEnabled, setRegistrationEnabled] = useState(event.registrationEnabled);
  const [isPrivate, setIsPrivate] = useState(event.isPrivate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...event,
      title: title.trim(),
      date,
      time,
      durationMinutes: Number(duration),
      mode,
      registrationEnabled,
      isPrivate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#1b2a4a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-medium">Configuración del Evento</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Título de la Obra o Función</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Hora Inicio</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Duración (min)</label>
              <input
                type="number"
                min="15"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
                required
              />
            </div>
          </div>

          {/* Modalidad de Asignación */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Modalidad de Sala y Butacas</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("SEATED_NUMBERED")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  mode === "SEATED_NUMBERED"
                    ? "bg-[#1b2a4a] text-white border-[#1b2a4a]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold block">Butacas Numeradas</span>
                <span className="text-[10px] opacity-80">Render de plano y selección libre</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("GENERAL_ADMISSION")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  mode === "GENERAL_ADMISSION"
                    ? "bg-[#1b2a4a] text-white border-[#1b2a4a]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold block">Aforo General</span>
                <span className="text-[10px] opacity-80">Llenado por orden de llegada</span>
              </button>
            </div>
          </div>

          {/* Conmutadores de Estado */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800">Habilitar Registros y Reservas al Público</span>
              <input
                type="checkbox"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
                className="w-4 h-4 text-[#1b2a4a] rounded focus:ring-[#1b2a4a]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800">Función Privada con Invitación Directa</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-[#1b2a4a] rounded focus:ring-[#1b2a4a]"
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b2a4a] hover:bg-[#233858] text-white rounded-lg font-medium flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
