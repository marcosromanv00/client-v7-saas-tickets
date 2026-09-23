import React, { useState } from "react";
import { Armchair, CheckCircle2, AlertCircle } from "lucide-react";
import { Seat, TheaterEvent, ZoneId } from "../tickets/types";

interface ReservationSummaryProps {
  event: TheaterEvent;
  selectedSeat: Seat | null;
  selectedZone: ZoneId;
  onConfirmReservation: (data: {
    citizenName: string;
    citizenId: string;
    citizenPhone?: string;
  }) => { success: boolean; error?: string };
}

export function ReservationSummary({ event, selectedSeat, selectedZone, onConfirmReservation }: ReservationSummaryProps) {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNumbered = event.mode === "SEATED_NUMBERED";
  const canSubmit = isNumbered ? !!selectedSeat : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isNumbered && !selectedSeat) {
      setError("Por favor seleccione una butaca en el plano para continuar.");
      return;
    }

    if (!name.trim() || idNumber.trim().length < 6) {
      setError("Indique su nombre completo y una cédula válida (mínimo 6 caracteres).");
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-serif text-base text-[#1b2a4a] font-medium">Resumen de Reserva</h3>
        <p className="text-xs text-slate-500 mt-0.5">{event.title}</p>
      </div>

      {/* Detalle de Butaca o Zona */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Ubicación asignada:</span>
          <span className="font-medium text-slate-800">
            {isNumbered
              ? selectedSeat
                ? selectedSeat.label
                : "Ninguna butaca seleccionada"
              : selectedZone === "PLANTA_BAJA"
              ? "Platea (Planta Baja)"
              : "Balcón (Segunda Planta)"}
          </span>
        </div>

        {isNumbered && selectedSeat && (
          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
            <Armchair className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Butaca reservada temporalmente mientras completa sus datos.</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
          <span className="text-slate-500">Costo de Entrada:</span>
          <span className="font-serif text-emerald-700 font-semibold">Gratuita (Subvención Cívica)</span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulario Rápido (3 campos máx según Anti-Slop Rule) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo del Espectador</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Laura Vargas Morales"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Cédula o Pasaporte</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Ej: 1-1524-0321"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono / WhatsApp (Opcional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 8899-7744"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full py-3 bg-[#1b2a4a] hover:bg-[#233858] disabled:bg-slate-300 text-white rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{isSubmitting ? "Emitiendo Tiquete..." : "Confirmar Reserva y Obtener Pase"}</span>
        </button>
      </form>
    </div>
  );
}
