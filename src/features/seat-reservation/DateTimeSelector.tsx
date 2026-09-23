import { motion } from "motion/react";

interface DateOption {
  date: string;
  dayName: string;
  dayNumber: string;
}

interface DateTimeSelectorProps {
  dates: DateOption[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  timeSlots: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export function DateTimeSelector({
  dates,
  selectedDate,
  onSelectDate,
  timeSlots,
  selectedTime,
  onSelectTime,
}: DateTimeSelectorProps) {
  return (
    <div className="space-y-4 text-left">
      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
        Seleccionar Fecha y Hora
      </h4>

      {/* Fila de Tarjetas de Fecha con Micro-Física */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {dates.map((d) => {
          const isSelected = selectedDate === d.date;
          return (
            <motion.button
              key={d.date}
              type="button"
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => onSelectDate(d.date)}
              className={`flex flex-col items-center justify-center min-w-16 py-3 px-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-b from-amber-500 to-amber-600 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
              }`}
            >
              <span className={`text-[10px] font-mono tracking-wider uppercase ${isSelected ? "text-slate-950" : "text-slate-400"}`}>
                {d.dayName}
              </span>
              <span className="text-lg font-serif mt-0.5 leading-none">
                {d.dayNumber}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Cápsulas de Hora */}
      <div className="flex items-center gap-2 flex-wrap">
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <motion.button
              key={time}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectTime(time)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400 shadow-sm shadow-amber-400/20 font-semibold"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
