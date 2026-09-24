import React, { useState } from "react";
import { ArrowLeft, Ticket as TicketIcon, AlertCircle, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import { TheaterEvent, Seat } from "../tickets/types";
import { LegalTermsModal } from "../../components/legal/LegalTermsModal";
import { CheckoutSummaryCard } from "./CheckoutSummaryCard";
import { CheckoutTermsCheckbox } from "./CheckoutTermsCheckbox";

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"terms" | "privacy">("terms");
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
    if (!acceptedTerms) {
      setError("Debes aceptar los Términos y Condiciones y la Política de Privacidad.");
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
          className="p-2.5 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg tracking-tight">Datos del Asistente Titular</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pases emitidos a este titular (Máximo 2 por cédula)</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-3xl p-6 shadow-sm space-y-6 transition-colors">
        <CheckoutSummaryCard
          event={event}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          activeSeats={activeSeats}
          totalPrice={totalPrice}
        />

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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cédula o Documento *</label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="1-1234-0567"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">WhatsApp (Opcional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+506 8888-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
              />
            </div>
          </div>

          <CheckoutTermsCheckbox
            acceptedTerms={acceptedTerms}
            onToggleTerms={setAcceptedTerms}
            onOpenLegalTab={(tab) => { setLegalTab(tab); setIsLegalModalOpen(true); }}
          />

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !acceptedTerms}
            className={`w-full py-4 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 ${
              acceptedTerms && !isSubmitting
                ? "bg-muni-red hover:bg-muni-red-hover text-white shadow-md shadow-red-900/25 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            <TicketIcon className="w-4 h-4" />
            <span>{isSubmitting ? "Emitiendo Boleto..." : "Confirmar Reserva y Emitir Boletos"}</span>
          </motion.button>
        </form>
      </div>

      <LegalTermsModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        defaultTab={legalTab}
      />
    </div>
  );
};
