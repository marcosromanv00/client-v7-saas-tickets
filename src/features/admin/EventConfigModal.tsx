import React, { useState } from "react";
import { X, Sliders, Save } from "lucide-react";
import { TheaterEvent, EventMode, BraceletColor } from "../tickets/types";
import { DEFAULT_BRACELET_COLORS } from "../tickets/bracelet-utils";
import { EventBraceletSelector } from "./EventBraceletSelector";

interface EventConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TheaterEvent;
  braceletColors?: BraceletColor[];
  onSave: (updated: TheaterEvent) => void;
}

export function EventConfigModal({
  isOpen,
  onClose,
  event,
  braceletColors = DEFAULT_BRACELET_COLORS,
  onSave,
}: EventConfigModalProps) {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [duration, setDuration] = useState(event.durationMinutes);
  const [mode, setMode] = useState<EventMode>(event.mode);
  const [selectedColorId, setSelectedColorId] = useState(event.braceletColorId || "azul-rey");
  const [registrationEnabled, setRegistrationEnabled] = useState(event.registrationEnabled);
  const [isPrivate, setIsPrivate] = useState(event.isPrivate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenColor = braceletColors.find((c) => c.id === selectedColorId) || {
      id: "azul-rey",
      name: "Azul Rey",
      hex: "#004ea2",
    };

    onSave({
      ...event,
      title: title.trim(),
      date,
      time,
      durationMinutes: Number(duration),
      mode,
      braceletColorId: chosenColor.id,
      braceletColorName: chosenColor.name,
      braceletColorHex: chosenColor.hex,
      registrationEnabled,
      isPrivate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-teatro-navy-border overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teatro-blue dark:text-blue-400" />
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Configuración del Evento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs text-left max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Título de la Función</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
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
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Hora Inicio</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
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
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
                required
              />
            </div>
          </div>

          <EventBraceletSelector
            braceletColors={braceletColors}
            selectedColorId={selectedColorId}
            onSelectColorId={setSelectedColorId}
          />

          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Modalidad de Sala</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("SEATED_NUMBERED")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === "SEATED_NUMBERED"
                    ? "bg-teatro-blue text-white font-semibold border-teatro-blue-hover shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                <span className="font-semibold block text-xs">Butacas Numeradas</span>
                <span className="text-[10px] opacity-80">Plano y selección</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("GENERAL_ADMISSION")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === "GENERAL_ADMISSION"
                    ? "bg-teatro-blue text-white font-semibold border-teatro-blue-hover shadow-xs"
                    : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                <span className="font-semibold block text-xs">Aforo General</span>
                <span className="text-[10px] opacity-80">Por orden de llegada</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#071324] p-3 rounded-2xl border border-slate-200 dark:border-[#1a3357] space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800 dark:text-slate-200">Habilitar Registros Públicos</span>
              <input
                type="checkbox"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
                className="w-4 h-4 text-teatro-blue rounded focus:ring-teatro-blue accent-teatro-blue"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-slate-800 dark:text-slate-200">Función Privada (Protocolo)</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-teatro-blue rounded focus:ring-teatro-blue accent-teatro-blue"
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-900/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
