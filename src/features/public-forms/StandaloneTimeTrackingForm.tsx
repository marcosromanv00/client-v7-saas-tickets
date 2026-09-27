import React from "react";
import { User, Ticket, LogIn } from "lucide-react";
import { StaffDuty } from "../staff/types";
import { TheaterEvent } from "../tickets/types";

interface StandaloneTimeTrackingFormProps {
  events: TheaterEvent[];
  selectedEventId: string;
  onEventChange: (id: string) => void;
  eventDate: string;
  onEventDateChange: (date: string) => void;
  staffName: string;
  onStaffNameChange: (name: string) => void;
  citizenId: string;
  onCitizenIdChange: (id: string) => void;
  duty: StaffDuty;
  onDutyChange: (duty: StaffDuty) => void;
  clockIn: string;
  onClockInChange: (time: string) => void;
  clockOut: string;
  onClockOutChange: (time: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StandaloneTimeTrackingForm: React.FC<StandaloneTimeTrackingFormProps> = ({
  events,
  selectedEventId,
  onEventChange,
  eventDate,
  onEventDateChange,
  staffName,
  onStaffNameChange,
  citizenId,
  onCitizenIdChange,
  duty,
  onDutyChange,
  clockIn,
  onClockInChange,
  clockOut,
  onClockOutChange,
  notes,
  onNotesChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-5 sm:p-7 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Función / Evento
        </label>
        <div className="relative">
          <Ticket className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedEventId}
            onChange={(e) => onEventChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Fecha de la Jornada
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => onEventDateChange(e.target.value)}
          className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nombre y Apellidos
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={staffName}
              onChange={(e) => onStaffNameChange(e.target.value)}
              placeholder="Ej. Juan Pérez Solís"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cédula Oficial
          </label>
          <input
            type="text"
            value={citizenId}
            onChange={(e) => onCitizenIdChange(e.target.value)}
            placeholder="Ej. 207890123"
            className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Puesto / Área Asignada
        </label>
        <select
          value={duty}
          onChange={(e) => onDutyChange(e.target.value as StaffDuty)}
          className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="PUERTA">🚪 Puerta / Escaneo de Códigos</option>
          <option value="TAQUILLA">🎟️ Taquilla Express</option>
          <option value="SALA">🛋️ Acomodador de Sala</option>
          <option value="INCIDENCIAS">🚨 Mesa de Incidencias</option>
          <option value="GENERAL">🛡️ Supervisión / Logística General</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Hora de Entrada
          </label>
          <input
            type="time"
            value={clockIn}
            onChange={(e) => onClockInChange(e.target.value)}
            className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Hora de Salida (Opcional)
          </label>
          <input
            type="time"
            value={clockOut}
            onChange={(e) => onClockOutChange(e.target.value)}
            className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Observaciones o Detalles
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Notas sobre el turno, relevos o novedades..."
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-[48px] py-3.5 rounded-2xl bg-teatro-blue hover:bg-teatro-blue-hover text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogIn className="w-4 h-4" />
        <span>Registrar Entrada / Jornada</span>
      </button>
    </form>
  );
};
