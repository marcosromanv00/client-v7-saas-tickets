import React, { useState } from "react";
import { TheaterEvent } from "../tickets/types";
import { Clock, Calendar, ArrowRight, MapPin } from "lucide-react";
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
  events,
  selectedEvent,
  onSelectEvent,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  onProceedToSeats,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. HERO DE LA OBRA CON PÓSTER CINEMATOGRÁFICO Y SCRIM */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#161122] shadow-2xl">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-700 hover:scale-100"
          />
          {/* Scrim gradiente direccional suave que garantiza legibilidad AAA */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161122] via-[#161122]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161122]/80 via-transparent to-transparent" />

          {/* Información superpuesta sobre la obra */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {selectedEvent.genre}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <Clock className="w-3 h-3 text-rose-400" /> {selectedEvent.durationMinutes} minutos
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <MapPin className="w-3 h-3 text-amber-400" /> Sala Principal
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl text-white font-medium tracking-tight">
              {selectedEvent.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {showFullDesc ? selectedEvent.description : `${selectedEvent.description.slice(0, 140)}... `}
              <button
                type="button"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-rose-400 font-semibold hover:underline inline-block ml-1"
              >
                {showFullDesc ? "mostrar menos" : "leer más"}
              </button>
            </p>
          </div>
        </div>

        {/* 2. SELECTOR DE FECHAS & HORARIOS */}
        <div className="p-6 sm:p-8 bg-[#161122]/90 border-t border-white/5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
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
                    className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-b from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/25 scale-105"
                        : "bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider">{d.dayName}</span>
                    <span className="text-lg sm:text-xl font-bold font-mono my-0.5">{d.dayNumber}</span>
                    <span className="text-[9px] opacity-80">Sept</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
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
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105 border border-rose-400"
                        : "bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {time} hrs
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTÓN PRINCIPAL DE AVANCE A BUTACAS */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onProceedToSeats}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 transition-all cursor-pointer"
            >
              <span>Elegir Butacas en Sala</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. OTRAS OBRAS EN CARTELERA DEL TEATRO */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Temporada y Cartelera Teatral
          </h2>
          <span className="text-xs text-zinc-500">Temporada 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {events.map((evt) => {
            const isCurrent = evt.id === selectedEvent.id;
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isCurrent
                    ? "bg-[#1f182c] border-rose-500/60 shadow-lg shadow-rose-500/10"
                    : "bg-[#140f1e]/80 border-white/5 hover:border-white/20 hover:bg-[#1a1427]"
                }`}
              >
                <img
                  src={evt.posterUrl}
                  alt={evt.title}
                  className="w-14 h-18 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400">{evt.genre}</p>
                  <p className="text-[10px] text-rose-400 font-mono">190 butacas autorizadas</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
