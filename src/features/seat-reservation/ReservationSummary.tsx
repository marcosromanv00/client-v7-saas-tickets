import { useState, type FormEvent } from "react";
import { Armchair, CheckCircle2, AlertCircle, Calendar, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Seat, TheaterEvent, ZoneId } from "../tickets/types";

interface ReservationSummaryProps {
  event: TheaterEvent;
  selectedSeat: Seat | null;
  selectedZone: ZoneId;
  selectedDate: string;
  selectedTime: string;
  onConfirmReservation: (data: {
    citizenName: string;
    citizenId: string;
    citizenPhone?: string;
  }) => { success: boolean; error?: string };
}

export function ReservationSummary({
  event,
  selectedSeat,
  selectedZone,
  selectedDate,
  selectedTime,
  onConfirmReservation,
}: ReservationSummaryProps) {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNumbered = event.mode === "SEATED_NUMBERED";
  const canSubmit = isNumbered ? !!selectedSeat : true;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isNumbered && !selectedSeat) {
      const msg = "Por favor elija una butaca en el plano para continuar.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!name.trim() || idNumber.trim().length < 6) {
      const msg = "Complete su nombre y número de documento (mínimo 6 caracteres).";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    const result = onConfirmReservation({
      citizenName: name.trim(),
      citizenId: idNumber.trim(),
      citizenPhone: phone.trim() || undefined,
    });

    if (!result.success) {
      setError(result.error || "No fue posible procesar la reserva.");
      toast.error(result.error || "Error al emitir reserva");
      setIsSubmitting(false);
    } else {
      toast.success("¡Reserva confirmada! Generando pase digital oficial...");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#11192b]/95 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5 text-left"
    >
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{selectedDate} • {selectedTime} hrs</span>
        </div>
        <h3 className="font-serif text-lg text-white font-medium line-clamp-1">{event.title}</h3>
      </div>

      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Butaca seleccionada:</span>
          <span className={`font-mono font-bold text-sm ${selectedSeat ? "text-cyan-400" : "text-amber-400"}`}>
            {isNumbered
              ? selectedSeat
                ? selectedSeat.label
                : "Ninguna butaca elegida"
              : selectedZone === "PLANTA_BAJA"
              ? "Platea General"
              : "Balcón General"}
          </span>
        </div>

        {isNumbered && selectedSeat && (
          <div className="flex items-center gap-2 text-xs text-cyan-200 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30">
            <Armchair className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Butaca apartada. Complete sus datos para emitir su boleto.</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
          <span className="text-slate-400">Entrada Oficial:</span>
          <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Gratuita (Acceso Cívico)
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-500/10 text-rose-300 text-xs rounded-xl border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-mono text-slate-300 mb-1">Nombre Completo del Asistente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Carmen Mora Rojas"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-300 mb-1">Cédula o Documento de Identidad</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Ej: 1-1120-0456"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-300 mb-1">Teléfono / WhatsApp (Opcional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 8844-1234"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? "Emitiendo Tiquete..." : "Confirmar Reserva y Obtener Pase"}</span>
        </motion.button>
      </form>
    </motion.div>
  );
}
