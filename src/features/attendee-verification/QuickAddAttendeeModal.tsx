import React, { useState } from "react";
import { X, UserPlus, ShieldCheck } from "lucide-react";
import { ZoneId } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";

interface QuickAddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onAttendeeAdded: (name: string, seatLabel: string) => void;
}

export const QuickAddAttendeeModal: React.FC<QuickAddAttendeeModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onAttendeeAdded,
}) => {
  const store = useTheaterStore();
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState<ZoneId>("PLATEA_BAJA");
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Ingrese un nombre válido (al menos 2 caracteres)");
      return;
    }
    if (citizenId.trim().length < 6) {
      setError("Ingrese una cédula o documento válido (al menos 6 caracteres)");
      return;
    }

    // Buscar una butaca disponible en la zona seleccionada
    const seats = store.seatsByEvent[eventId] || [];
    const availableSeat = seats.find(
      (s) => s.zone === zone && (s.status === "AVAILABLE" || s.status === undefined)
    );

    const bookingResult = store.bookTicket({
      eventId,
      citizenName: name.trim(),
      citizenId: citizenId.trim(),
      citizenPhone: phone.trim() || undefined,
      seatId: availableSeat?.id || null,
      zone,
      isVipGuest: isVip,
      notes: notes.trim() || undefined,
    });

    if (bookingResult.success && bookingResult.ticket) {
      // Auto check-in para entrada in-situ
      store.checkInTicket(bookingResult.ticket.id);
      onAttendeeAdded(name.trim(), bookingResult.ticket.seatLabel || "General");
      onClose();
      // Reset
      setName("");
      setCitizenId("");
      setPhone("");
      setNotes("");
      setError(null);
    } else {
      setError(bookingResult.error || "No fue posible registrar al asistente.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0c1a2f] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teatro-blue/10 dark:bg-blue-500/20 text-teatro-blue dark:text-blue-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Registro In-situ en Puerta
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Acredita con ingreso inmediato a sala
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[11px] border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre Completo o Delegación *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Roberto Méndez Solano"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teatro-blue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cédula / Documento *
              </label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="Ej. 1-0987-0654"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teatro-blue font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 8844-0011"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teatro-blue font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Zona de Butaca Deseada
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value as ZoneId)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teatro-blue"
            >
              <option value="PLATEA_BAJA">Platea Baja (Nivel 1 - Frente al Escenario)</option>
              <option value="NIVEL_MEDIO">Nivel Medio (Nivel 2)</option>
              <option value="BALCON_ALTO">Balcón Superior (Nivel 3)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vipCheckbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="vipCheckbox" className="text-xs text-slate-700 dark:text-slate-300 select-none cursor-pointer">
              Asignar como Invitación Protocolar / VIP
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acreditar e Ingresar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
