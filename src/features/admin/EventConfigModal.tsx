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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-[#1e355b] overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-[#1e355b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#004ea2] dark:text-blue-400" />
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Configuración del Evento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-left">
          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Título de la Función</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Hora Inicio</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Duración (min)</label>
              <input
                type="number"
                min="15"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
                required
              />
            </div>
          </div>

          {/* Modalidad de Asignación */}
          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">Modalidad de Sala y Butacas</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("SEATED_NUMBERED")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === "SEATED_NUMBERED"
                    ? "bg-[#004ea2] text-white font-semibold border-[#003c80] shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="font-semibold block">Butacas Numeradas</span>
                <span className="text-[10px] opacity-80">Render de plano y selección</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("GENERAL_ADMISSION")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === "GENERAL_ADMISSION"
                    ? "bg-[#004ea2] text-white font-semibold border-[#003c80] shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="font-semibold block">Aforo General</span>
                <span className="text-[10px] opacity-80">Orden de llegada en puerta</span>
              </button>
            </div>
          </div>

          {/* Conmutadores de Estado */}
          <div className="bg-slate-50 dark:bg-[#071324] p-4 rounded-2xl border border-slate-200 dark:border-[#1a3357] space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800 dark:text-slate-200">Habilitar Registros y Reservas Públicas</span>
              <input
                type="checkbox"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
                className="w-4 h-4 text-[#004ea2] rounded focus:ring-[#004ea2] accent-[#004ea2]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800 dark:text-slate-200">Función Privada con Invitación Directa</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-[#004ea2] rounded focus:ring-[#004ea2] accent-[#004ea2]"
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-900/20 transition-colors cursor-pointer"
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
