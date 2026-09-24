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
      className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-6 shadow-sm space-y-5 text-left transition-colors"
    >
      {/* Resumen de Butaca Seleccionada */}
      <div className="bg-slate-50 dark:bg-[#071324] p-3.5 rounded-2xl border border-slate-200 dark:border-[#1a3357] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
            <span className="font-mono text-slate-700 dark:text-slate-300">{selectedDate} • {selectedTime} hrs</span>
          </span>
          <span className="font-mono font-bold text-sm text-teatro-blue dark:text-blue-400">
            {isNumbered
              ? selectedSeat
                ? selectedSeat.label
                : "Elegir Butaca"
              : selectedZone === "PLANTA_BAJA"
              ? "Platea General"
              : "Balcón General"}
          </span>
        </div>

        {isNumbered && selectedSeat && (
          <div className="flex items-center gap-2 text-xs text-teatro-blue dark:text-blue-300 bg-teatro-blue-light dark:bg-teatro-blue/15 p-2.5 rounded-xl border border-teatro-blue/25 dark:border-blue-500/30">
            <Armchair className="w-4 h-4 text-teatro-blue dark:text-blue-400 shrink-0" />
            <span>Butaca apartada. Complete sus datos para emitir su boleto.</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-[#1a3357]">
          <span className="text-slate-500 dark:text-slate-400">Entrada Oficial:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Gratuita (Acceso Cívico Municipal)
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Nombre Completo del Asistente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Carmen Mora Rojas"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue dark:focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cédula o Documento de Identidad</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Ej: 1-1120-0456"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue dark:focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Teléfono / WhatsApp (Opcional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 8844-1234"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue dark:focus:border-blue-500 transition-colors"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full py-3.5 bg-muni-red hover:bg-muni-red-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold rounded-2xl text-xs transition-all shadow-md shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? "Emitiendo Tiquete..." : "Confirmar Reserva y Obtener Pase"}</span>
        </motion.button>
      </form>
    </motion.div>
  );
}
