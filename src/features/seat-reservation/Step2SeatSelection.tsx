import React from "react";
import { TheaterEvent, Seat } from "../tickets/types";
import { TheaterSeatMap } from "./TheaterSeatMap";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { motion } from "motion/react";

interface Step2SeatSelectionProps {
  event: TheaterEvent;
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  selectedDate: string;
  selectedTime: string;
  onBackToShow: () => void;
  onProceedToCheckout: () => void;
}

export const Step2SeatSelection: React.FC<Step2SeatSelectionProps> = ({
  event,
  seats,
  selectedSeatIds,
  onToggleSeat,
  selectedDate,
  selectedTime,
  onBackToShow,
  onProceedToCheckout,
}) => {
  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const pricePerSeat = event.isPrivate ? 0 : 8000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const formattedDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* BARRA SUPERIOR DE NAVEGACIÓN Y DETALLE DE LA FUNCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#e5e1d9] shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToShow}
            className="p-2.5 rounded-2xl bg-[#f7f5f1] border border-[#e5e1d9] text-[#171717] hover:bg-stone-100 transition-colors cursor-pointer"
            title="Cambiar fecha u obra"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-[#171717] font-medium font-serif text-base sm:text-lg line-clamp-1">{event.title}</h2>
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <span className="capitalize">{formattedDate}</span>
              <span>•</span>
              <span className="font-mono text-[#6d174f] font-semibold">{selectedTime} hrs</span>
              <span>•</span>
              <span>Sala Principal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-[#6d174f]/10 text-[#6d174f] border border-[#6d174f]/25 font-semibold">
            {selectedSeatIds.length} {selectedSeatIds.length === 1 ? "butaca elegida" : "butacas elegidas"}
          </span>
        </div>
      </div>

      {/* DISPOSICIÓN PRINCIPAL: MAPA (IZQUIERDA) Y RESUMEN STICKY (DERECHA EN DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAPA ARQUITECTÓNICO DE BUTACAS */}
        <div className="lg:col-span-8">
          <TheaterSeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
          />
        </div>

        {/* RESUMEN DE RESERVA EN DESKTOP (STICKY) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-white border border-[#e5e1d9] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e5e1d9]">
              <img src={event.posterUrl} alt={event.title} className="w-14 h-20 rounded-xl object-cover shrink-0 shadow-xs" />
              <div>
                <span className="text-[10px] font-mono text-[#6d174f] uppercase tracking-wider font-semibold">{event.genre}</span>
                <h3 className="text-sm font-semibold text-[#171717] font-serif line-clamp-2">{event.title}</h3>
                <p className="text-xs text-[#737373] capitalize mt-1">{formattedDate} • {selectedTime} hrs</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#737373] mb-2">
                <span className="font-medium text-[#171717]">Butacas Seleccionadas</span>
                <span className="font-mono">{selectedSeats.length} / 6 máx</span>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-[#e5e1d9] bg-[#f7f5f1] text-center text-xs text-[#737373]">
                  Toca las butacas en el mapa para seleccionarlas
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono bg-[#6d174f]/10 text-[#6d174f] border border-[#6d174f]/25 font-semibold"
                    >
                      <span>{s.label}</span>
                      <button
                        type="button"
                        onClick={() => onToggleSeat(s)}
                        className="hover:text-[#54103c] transition-colors"
                        title="Quitar butaca"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e5e1d9] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#737373]">
                <span>Tarifa por butaca</span>
                <span className="font-mono text-[#171717] font-medium">{event.isPrivate ? "Gratuito (Subvencionado)" : `₡${pricePerSeat.toLocaleString("es-CR")}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-[#171717]">
                <span>Total Estimado</span>
                <span className="font-mono text-base text-[#6d174f] font-bold">{event.isPrivate ? "₡0 (Acceso Libre)" : `₡${totalPrice.toLocaleString("es-CR")}`}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onProceedToCheckout}
              disabled={selectedSeatIds.length === 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                selectedSeatIds.length > 0
                  ? "bg-[#6d174f] hover:bg-[#54103c] text-white shadow-[#6d174f]/20 cursor-pointer"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <span>Continuar con Datos</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE PERSISTENTE EN MÓVIL */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#e5e1d9] z-40 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#737373] block">
              {selectedSeatIds.length === 0 ? "Sin butacas elegidas" : `${selectedSeatIds.length} butacas elegidas`}
            </span>
            <span className="text-sm font-bold text-[#171717] font-mono">
              {event.isPrivate ? "Entrada Libre" : `₡${totalPrice.toLocaleString("es-CR")}`}
            </span>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout}
            disabled={selectedSeatIds.length === 0}
            className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              selectedSeatIds.length > 0
                ? "bg-[#6d174f] text-white shadow-md shadow-[#6d174f]/25 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
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
