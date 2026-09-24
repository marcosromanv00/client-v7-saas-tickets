import React from "react";
import { TheaterEvent } from "../tickets/types";

interface DoorEventHeaderProps {
  events: TheaterEvent[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  currentEvent: TheaterEvent;
}

export const DoorEventHeader: React.FC<DoorEventHeaderProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  currentEvent,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
      <div>
        <span className="text-[10px] font-mono uppercase text-teatro-blue dark:text-blue-400 tracking-widest font-semibold">
          Capa 2 • Acreditación y Puerta
        </span>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
          Control de Acceso y Lector QR
        </h1>
        {/* Badge Oficial del Brazalete para este Evento */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs">
          <span
            className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
            style={{ backgroundColor: currentEvent.braceletColorHex || "#004ea2" }}
          />
          <span className="text-slate-600 dark:text-slate-300">
            Brazalete Oficial:{" "}
            <strong className="text-slate-900 dark:text-white font-bold">
              {currentEvent.braceletColorName || "Azul Rey"}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="door-event-select" className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Función:
        </label>
        <select
          id="door-event-select"
          value={selectedEventId}
          onChange={(e) => onSelectEventId(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teatro-blue"
        >
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title} ({evt.time} hrs)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
