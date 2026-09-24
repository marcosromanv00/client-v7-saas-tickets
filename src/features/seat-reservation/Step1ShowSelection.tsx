import React, { useState } from "react";
import { TheaterEvent } from "../tickets/types";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Step1ShowSelectionProps {
  events: TheaterEvent[];
  selectedEvent: TheaterEvent;
  onSelectEvent: (event: TheaterEvent) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  onProceedToSeats: () => void;
}

export const Step1ShowSelection: React.FC<Step1ShowSelectionProps> = ({
  events, selectedEvent, onSelectEvent, selectedDate, onSelectDate, selectedTime, onSelectTime, onProceedToSeats,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const SPANISH_MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];
  const getMonth = (dStr: string) => SPANISH_MONTHS[parseInt(dStr.split("-")[1], 10) - 1] || "Set";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO DE LA OBRA CON PÓSTER Y SCRIM */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-teatro-navy-border bg-white dark:bg-[#0b1a30] shadow-md transition-colors">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-transparent to-transparent" />

          {/* Información superpuesta sobre la obra */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-teatro-blue shadow-xs">
                {selectedEvent.genre}
              </span>
              {selectedEvent.isPrivate ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                  🔒 Gala Privada • Invitación Directa
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-muni-red text-white shadow-xs">
                  Entrada Libre
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-slate-200 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md">
                <Clock className="w-3 h-3 text-teatro-gold" /> {selectedEvent.durationMinutes} min
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
              {selectedEvent.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
              {showFullDesc ? selectedEvent.description : `${selectedEvent.description.slice(0, 140)}... `}
              <button
                type="button"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-amber-300 font-semibold hover:underline inline-block ml-1 cursor-pointer"
              >
                {showFullDesc ? "mostrar menos" : "leer más"}
              </button>
            </p>
          </div>
        </div>

        {/* 2. SELECTOR DE FECHAS & HORARIOS */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0b1a30] border-t border-slate-200 dark:border-teatro-navy-border space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Selecciona Fecha de la Función
              </h3>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {selectedEvent.datesAvailable?.map((d) => {
                const isSelected = d.date === selectedDate;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => onSelectDate(d.date)}
                    className={`flex flex-col items-center justify-center min-w-17.5 sm:min-w-20 py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teatro-blue border-teatro-blue-hover text-white shadow-md shadow-blue-900/25 scale-105"
                        : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider">{d.dayName}</span>
                    <span className="text-lg sm:text-xl font-bold font-mono my-0.5">{d.dayNumber}</span>
                    <span className="text-[9px] opacity-80">{getMonth(d.date)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Selecciona Horario de Entrada
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {selectedEvent.timeSlots?.map((time) => {
                const isSelected = time === selectedTime;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onSelectTime(time)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teatro-blue text-white shadow-xs scale-105 border border-teatro-blue-hover"
                        : "bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {time} hrs
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTÓN PRINCIPAL DE AVANCE A BUTACAS - ROJO MUNICIPAL */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onProceedToSeats}
              className="w-full sm:w-auto px-8 py-3.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-3 shadow-lg shadow-red-900/20 transition-all cursor-pointer"
            >
              <span>{selectedEvent.isPrivate ? "Ver Butacas y Espacios Reservados" : "Elegir Butacas en Sala"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. CARTELERA COMPLETA DE LA TEMPORADA OFICIAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cartelera Oficial del Teatro ({events.length} Obras y Conciertos)
          </h2>
          <span className="text-xs text-teatro-gold dark:text-amber-400 font-mono">Temporada 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-115 overflow-y-auto pr-1">
          {events.map((evt) => {
            const isCurrent = evt.id === selectedEvent.id;
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isCurrent
                    ? "bg-teatro-blue-light dark:bg-teatro-blue/20 border-teatro-blue dark:border-blue-500/40 shadow-xs"
                    : "bg-white dark:bg-[#0b1a30] border-slate-200 dark:border-teatro-navy-border hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <img
                  src={evt.posterUrl}
                  alt={evt.title}
                  className="w-14 h-18 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teatro-blue dark:group-hover:text-blue-400 transition-colors truncate">
                    {evt.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{evt.genre}</p>
                  <p className="text-[10px] text-teatro-blue dark:text-blue-400 font-mono">
                    {evt.isPrivate ? "🔒 Gala Privada" : "220 butacas libres"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
