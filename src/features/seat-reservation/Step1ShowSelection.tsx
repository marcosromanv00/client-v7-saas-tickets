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
      <div className="relative rounded-3xl overflow-hidden border border-[#e5e1d9] bg-white shadow-md">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-700 hover:scale-100"
          />
          {/* Scrim gradiente direccional suave que garantiza legibilidad AAA */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171717]/80 via-transparent to-transparent" />

          {/* Información superpuesta sobre la obra */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#6d174f] shadow-xs">
                {selectedEvent.genre}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-200 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <Clock className="w-3 h-3 text-[#b58a3a]" /> {selectedEvent.durationMinutes} minutos
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-200 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <MapPin className="w-3 h-3 text-[#b58a3a]" /> Sala Principal
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl text-white font-medium tracking-tight">
              {selectedEvent.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-200 max-w-2xl leading-relaxed">
              {showFullDesc ? selectedEvent.description : `${selectedEvent.description.slice(0, 140)}... `}
              <button
                type="button"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-amber-200 font-semibold hover:underline inline-block ml-1"
              >
                {showFullDesc ? "mostrar menos" : "leer más"}
              </button>
            </p>
          </div>
        </div>

        {/* 2. SELECTOR DE FECHAS & HORARIOS */}
        <div className="p-6 sm:p-8 bg-white border-t border-[#e5e1d9] space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#6d174f]" />
              <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
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
                        ? "bg-[#6d174f] border-[#54103c] text-white shadow-md shadow-[#6d174f]/25 scale-105"
                        : "bg-[#f7f5f1] border-[#e5e1d9] text-[#737373] hover:text-[#171717] hover:border-stone-300"
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
              <Clock className="w-4 h-4 text-[#6d174f]" />
              <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
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
                        ? "bg-[#6d174f] text-white shadow-xs scale-105 border border-[#54103c]"
                        : "bg-[#f7f5f1] border border-[#e5e1d9] text-[#737373] hover:text-[#171717] hover:border-stone-300"
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
              className="w-full sm:w-auto px-8 py-3.5 bg-[#6d174f] hover:bg-[#54103c] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#6d174f]/20 transition-all cursor-pointer"
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            Temporada y Cartelera Teatral
          </h2>
          <span className="text-xs text-[#b58a3a] font-mono">Temporada 2026</span>
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
                    ? "bg-[#fbf7ee] border-[#b58a3a] shadow-sm"
                    : "bg-white border-[#e5e1d9] hover:border-stone-300 hover:bg-stone-50/60"
                }`}
              >
                <img
                  src={evt.posterUrl}
                  alt={evt.title}
                  className="w-14 h-18 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-[#171717] group-hover:text-[#6d174f] transition-colors line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="text-[11px] text-[#737373]">{evt.genre}</p>
                  <p className="text-[10px] text-[#6d174f] font-mono">190 butacas autorizadas</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
