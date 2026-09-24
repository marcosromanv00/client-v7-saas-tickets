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
      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Seleccionar Fecha y Hora
      </h4>

      {/* Fila de Tarjetas de Fecha */}
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
                  ? "bg-teatro-blue border-teatro-blue-hover text-white font-bold shadow-md shadow-blue-900/20 scale-105"
                  : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <span className={`text-[10px] font-mono tracking-wider uppercase ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                {d.dayName}
              </span>
              <span className="text-lg font-bold font-mono mt-0.5 leading-none">
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
                  ? "bg-teatro-blue/15 text-teatro-blue dark:text-blue-400 border border-teatro-blue font-semibold"
                  : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1a3357] hover:text-slate-900 dark:hover:text-slate-200"
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
