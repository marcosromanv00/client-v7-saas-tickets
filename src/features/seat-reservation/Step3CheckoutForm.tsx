import React, { useState, type FormEvent } from "react";
import { TheaterEvent, Seat } from "../tickets/types";
import { ArrowLeft, Ticket as TicketIcon, User, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface Step3CheckoutFormProps {
  event: TheaterEvent;
  seats: Seat[];
  selectedSeatIds: string[];
  selectedDate: string;
  selectedTime: string;
  onBackToSeats: () => void;
  onSubmit: (data: { citizenName: string; citizenId: string; citizenEmail: string; citizenPhone?: string }) => void;
  isSubmitting?: boolean;
}

export const Step3CheckoutForm: React.FC<Step3CheckoutFormProps> = ({
  event,
  seats,
  selectedSeatIds,
  selectedDate,
  selectedTime,
  onBackToSeats,
  onSubmit,
  isSubmitting = false,
}) => {
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const pricePerSeat = event.isPrivate ? 0 : 8000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !citizenId.trim() || !email.trim()) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }
    setError(null);
    onSubmit({
      citizenName: name.trim(),
      citizenId: citizenId.trim(),
      citizenEmail: email.trim(),
      citizenPhone: phone.trim() || undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToSeats}
          className="p-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-white font-medium font-serif text-lg">Datos del Asistente Titular</h2>
          <p className="text-xs text-zinc-400">Los boletos digitales serán emitidos a este nombre y cédula</p>
        </div>
      </div>

      <div className="bg-[#161122]/95 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Resumen de la reserva */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Función:</span>
            <span className="text-white font-serif">{event.title}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Fecha y Hora:</span>
            <span className="text-rose-400 font-mono">{selectedDate} • {selectedTime} hrs</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Butacas Asignadas:</span>
            <span className="text-white font-mono font-bold">
              {selectedSeats.map((s) => s.label).join(", ")}
            </span>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Total:</span>
            <span className="text-sm font-mono font-bold text-rose-400">
              {event.isPrivate ? "₡0 (Acceso Subvencionado)" : `₡${totalPrice.toLocaleString("es-CR")}`}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 text-rose-300 text-xs rounded-xl border border-rose-500/30 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Nombre Completo *</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Valeria Mora Solís"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Cédula o Pasaporte *</label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="1-1234-0567"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">WhatsApp (Opcional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+506 8888-0000"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Correo Electrónico (Para recibir el pase) *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="valeria@correo.cr"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="p-3 bg-zinc-900/40 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantía de Ingreso Cívico</span>
            </div>
            <p>Apertura de puertas 45 min antes. Las butacas se reservan hasta 10 min antes del inicio de función.</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-bold rounded-2xl text-xs shadow-xl shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <TicketIcon className="w-4 h-4" />
            <span>{isSubmitting ? "Emitiendo Boleto..." : "Confirmar Reserva y Emitir Boletos"}</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
