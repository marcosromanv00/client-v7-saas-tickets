import React, { useMemo } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { motion } from "motion/react";
import { TheaterEvent, Seat } from "../tickets/types";
import { TheaterSeatMap } from "./TheaterSeatMap";

interface Step2SeatSelectionProps {
  event: TheaterEvent;
  selectedDate: string;
  selectedTime: string;
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  onProceedToCheckout: () => void;
  onBackToShow: () => void;
}

export const Step2SeatSelection: React.FC<Step2SeatSelectionProps> = ({
  event,
  selectedDate,
  selectedTime,
  seats,
  selectedSeatIds,
  onToggleSeat,
  onProceedToCheckout,
  onBackToShow,
}) => {
  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const pricePerSeat = event.price || 0;
  const totalPrice = event.isPrivate ? 0 : selectedSeats.length * pricePerSeat;

  const formattedDate = useMemo(() => {
    const d = event.datesAvailable?.find((item) => item.date === selectedDate);
    return d ? `${d.dayName} ${d.dayNumber} de Septiembre` : selectedDate;
  }, [event, selectedDate]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      {/* BARRA SUPERIOR COMPACTA DE NAVEGACIÓN Y DETALLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-[#0b1a30] p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xs transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToShow}
            className="p-2 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cambiar fecha u obra"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h2 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base tracking-tight line-clamp-1">{event.title}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="capitalize">{formattedDate}</span>
              <span>•</span>
              <span className="font-mono text-teatro-blue dark:text-blue-400 font-semibold">{selectedTime} hrs</span>
              <span>•</span>
              <span>Sala Principal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-teatro-blue/10 text-teatro-blue dark:text-blue-400 border border-teatro-blue/25 font-semibold">
            {selectedSeatIds.length} {selectedSeatIds.length === 1 ? "butaca elegida" : "butacas elegidas"}
          </span>
        </div>
      </div>

      {/* DISPOSICIÓN PRINCIPAL: MAPA (IZQUIERDA) Y RESUMEN STICKY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8">
          <TheaterSeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
          />
        </div>

        {/* RESUMEN DE RESERVA EN DESKTOP (STICKY) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-teatro-navy-border">
              <img src={event.posterUrl} alt={event.title} className="w-14 h-20 rounded-xl object-cover shrink-0 shadow-xs" />
              <div>
                <span className="text-[10px] font-mono text-teatro-blue dark:text-blue-400 uppercase tracking-wider font-semibold">{event.genre}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{event.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{formattedDate} • {selectedTime} hrs</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">Butacas Seleccionadas</span>
                <span className="font-mono font-semibold text-teatro-blue dark:text-blue-400">{selectedSeats.length} / 2 máx</span>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-[#1a3357] bg-slate-50 dark:bg-[#071324] text-center text-xs text-slate-500 dark:text-slate-400">
                  Toca las butacas en el mapa para seleccionarlas
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono bg-teatro-blue/10 text-teatro-blue dark:text-blue-400 border border-teatro-blue/25 font-semibold"
                    >
                      <span>{s.label}</span>
                      <button
                        type="button"
                        onClick={() => onToggleSeat(s)}
                        className="hover:text-red-500 transition-colors cursor-pointer"
                        title="Quitar butaca"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-teatro-navy-border space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Tarifa por butaca</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">{event.isPrivate ? "Gratuito (Subvencionado)" : `₡${pricePerSeat.toLocaleString("es-CR")}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
                <span>Total Estimado</span>
                <span className="font-mono text-base text-teatro-blue dark:text-blue-400 font-bold">{event.isPrivate ? "₡0 (Acceso Libre)" : `₡${totalPrice.toLocaleString("es-CR")}`}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onProceedToCheckout}
              disabled={selectedSeatIds.length === 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                selectedSeatIds.length > 0
                  ? "bg-muni-red hover:bg-muni-red-hover text-white shadow-red-900/20 cursor-pointer"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Continuar con Datos</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE EN MÓVIL */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#0b1a30]/95 backdrop-blur-xl border-t border-slate-200 dark:border-teatro-navy-border z-40 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {selectedSeatIds.length === 0 ? "Sin butacas elegidas" : `${selectedSeatIds.length} butacas elegidas`}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {event.isPrivate ? "Entrada Libre" : `₡${totalPrice.toLocaleString("es-CR")}`}
            </span>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout}
            disabled={selectedSeatIds.length === 0}
            className={`px-6 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedSeatIds.length > 0
                ? "bg-muni-red hover:bg-muni-red-hover text-white shadow-md shadow-red-900/25 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Continuar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
