import React, { useState } from "react";
import { TheaterEvent } from "../tickets/types";
import { Clock, Calendar, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { evaluateEventCutoff } from "../tickets/cutoff-utils";
import { SeasonShowcaseGrid } from "./SeasonShowcaseGrid";

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

  const cutoff = evaluateEventCutoff(selectedDate, selectedTime, 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO DE LA OBRA */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-teatro-navy-border bg-white dark:bg-[#0b1a30] shadow-md transition-colors">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-transparent to-transparent" />

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

        {/* 2. SELECTOR DE FECHAS & HORARIOS CON REGLA DE 20 MINUTOS */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0b1a30] border-t border-slate-200 dark:border-teatro-navy-border space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Selecciona Fecha de la Función
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectedEvent.datesAvailable?.map((d) => {
                const isSelected = d.date === selectedDate;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => onSelectDate(d.date)}
                    className={`flex flex-col items-center justify-center min-w-20 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teatro-blue text-white border-teatro-blue shadow-md scale-102"
                        : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-300 hover:border-teatro-blue/40"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase">{d.dayName}</span>
                    <span className="text-lg font-bold font-mono leading-none my-0.5">{d.dayNumber}</span>
                    <span className="text-[9px] uppercase tracking-wide opacity-80">{getMonth(d.date)}</span>
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
                const slotCutoff = evaluateEventCutoff(selectedDate, time, 20);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onSelectTime(time)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-teatro-blue text-white shadow-xs scale-105 border border-teatro-blue-hover"
                        : "bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    } ${slotCutoff.isWebLocked ? "border-amber-400/60" : ""}`}
                  >
                    <span>{time} hrs</span>
                    {slotCutoff.isWebLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        Cierre Web
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner de aviso si las reservas web están cerradas a menos de 20 min */}
          {cutoff.isWebLocked && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-amber-800 dark:text-amber-200">
                  Boletería Web Cerrada ({cutoff.statusText})
                </p>
                <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                  Por proximidad al inicio de la obra (faltan {cutoff.minutesRemaining > 0 ? `${cutoff.minutesRemaining} min` : "menos de 20 min"}), las reservas en línea se encuentran deshabilitadas. Por favor solicite sus butacas disponibles directamente en la mesa de registro físico del Teatro Municipal.
                </p>
              </div>
            </div>
          )}

          {/* Botón Principal de avance a butacas */}
          <div className="pt-2">
            <motion.button
              whileTap={!cutoff.isWebLocked ? { scale: 0.98 } : {}}
              type="button"
              disabled={cutoff.isWebLocked}
              onClick={onProceedToSeats}
              className={`w-full sm:w-auto px-8 py-3.5 font-semibold rounded-2xl text-sm flex items-center justify-center gap-3 transition-all ${
                cutoff.isWebLocked
                  ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700"
                  : "bg-muni-red hover:bg-muni-red-hover text-white shadow-lg shadow-red-900/20 cursor-pointer"
              }`}
            >
              <span>
                {cutoff.isWebLocked
                  ? "Boletería Web Cerrada (Acérquese a Taquilla)"
                  : selectedEvent.isPrivate
                  ? "Ver Butacas y Espacios Reservados"
                  : "Elegir Butacas en Sala"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. CARTELERA COMPLETA DE LA TEMPORADA OFICIAL */}
      <SeasonShowcaseGrid events={events} selectedEvent={selectedEvent} onSelectEvent={onSelectEvent} />
    </div>
  );
};
