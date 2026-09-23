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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#111827] rounded-3xl shadow-2xl max-w-lg w-full border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 text-slate-100">
        <div className="px-6 py-4 bg-[#162032] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-medium text-white">Configuración del Evento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-left">
          <div>
            <label className="block font-mono text-slate-300 mb-1">Título de la Función</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-slate-300 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-300 mb-1">Hora Inicio</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-300 mb-1">Duración (min)</label>
              <input
                type="number"
                min="15"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Modalidad de Asignación */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5">Modalidad de Sala y Butacas</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("SEATED_NUMBERED")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  mode === "SEATED_NUMBERED"
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span className="font-semibold block">Butacas Numeradas</span>
                <span className="text-[10px] opacity-80">Render de plano y selección</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("GENERAL_ADMISSION")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  mode === "GENERAL_ADMISSION"
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span className="font-semibold block">Aforo General</span>
                <span className="text-[10px] opacity-80">Orden de llegada en puerta</span>
              </button>
            </div>
          </div>

          {/* Conmutadores de Estado */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-white">Habilitar Registros y Reservas Públicas</span>
              <input
                type="checkbox"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 accent-amber-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-white">Función Privada con Invitación Directa</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 accent-amber-500"
              />
            </label>
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
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
