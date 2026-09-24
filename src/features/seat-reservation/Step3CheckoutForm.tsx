import React, { useState } from "react";
import { ArrowLeft, Ticket as TicketIcon, AlertCircle, ShieldCheck, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import { TheaterEvent, Seat } from "../tickets/types";

interface Step3CheckoutFormProps {
  event: TheaterEvent;
  selectedDate: string;
  selectedTime: string;
  seats?: Seat[];
  selectedSeatIds?: string[];
  selectedSeats?: Seat[];
  onBackToSeats: () => void;
  onSubmit?: (data: { citizenName: string; citizenId: string; citizenEmail: string; citizenPhone?: string }) => void;
  onSubmitBooking?: (formData: { name: string; citizenId: string; email: string; phone?: string }) => void;
}

export const Step3CheckoutForm: React.FC<Step3CheckoutFormProps> = ({
  event,
  selectedDate,
  selectedTime,
  seats = [],
  selectedSeatIds = [],
  selectedSeats,
  onBackToSeats,
  onSubmit,
  onSubmitBooking,
}) => {
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSeats = selectedSeats || seats.filter((s) => selectedSeatIds.includes(s.id));
  const pricePerSeat = event.price || 0;
  const totalPrice = event.isPrivate ? 0 : activeSeats.length * pricePerSeat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !citizenId.trim() || !email.trim()) {
      setError("Por favor completa los campos obligatorios (*).");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const citizen = { name: name.trim(), citizenId: citizenId.trim(), email: email.trim(), phone: phone.trim() || undefined };
      onSubmitBooking?.(citizen);
      onSubmit?.({ citizenName: citizen.name, citizenId: citizen.citizenId, citizenEmail: citizen.email, citizenPhone: citizen.phone });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToSeats}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg tracking-tight">Datos del Asistente Titular</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Los boletos digitales serán emitidos a este nombre y cédula</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-3xl p-6 shadow-sm space-y-6 transition-colors">
        {/* Resumen de la reserva */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Función:</span>
            <span className="text-slate-900 dark:text-white font-semibold">{event.title}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Fecha y Hora:</span>
            <span className="text-[#004ea2] dark:text-blue-400 font-mono font-medium">{selectedDate} • {selectedTime} hrs</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Butacas Asignadas:</span>
            <span className="text-slate-900 dark:text-white font-mono font-bold">
              {activeSeats.length > 0 ? activeSeats.map((s) => s.label).join(", ") : "Entrada General"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-[#1a3357] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total:</span>
            <span className="text-sm font-mono font-bold text-[#004ea2] dark:text-blue-400">
              {event.isPrivate ? "₡0 (Acceso Subvencionado)" : `₡${totalPrice.toLocaleString("es-CR")}`}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Nombre Completo *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Valeria Mora Solís"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0c1e36] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cédula o Pasaporte *</label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="1-1234-0567"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0c1e36] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">WhatsApp (Opcional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+506 8888-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0c1e36] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Correo Electrónico (Para recibir el pase) *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="valeria@correo.cr"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0c1e36] transition-colors"
              />
            </div>
          </div>

          <div className="p-3 bg-[#ebf3fc] dark:bg-[#004ea2]/15 rounded-xl border border-[#004ea2]/25 dark:border-blue-500/30 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-[#004ea2] dark:text-blue-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Garantía de Ingreso Cívico • Teatro Municipal de Alajuela</span>
            </div>
            <p>Apertura de puertas 45 min antes. Las butacas se reservan hasta 10 min antes del inicio de función.</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-2xl text-xs shadow-md shadow-red-900/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <TicketIcon className="w-4 h-4" />
            <span>{isSubmitting ? "Emitiendo Boleto..." : "Confirmar Reserva y Emitir Boletos"}</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
