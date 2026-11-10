import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Calendar, Clock } from "lucide-react";
import { TheaterEvent } from "../../features/tickets/types";

interface EventSelectProps {
  events: TheaterEvent[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  className?: string;
  label?: string;
}

export const EventSelect: React.FC<EventSelectProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  className = "",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      {label && (
        <span className="block text-3xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100/80 dark:bg-[#071324] dark:hover:bg-[#0f2442] border border-slate-200/80 dark:border-[#1a3357] rounded-xl text-left transition-all cursor-pointer shadow-2xs focus:ring-2 focus:ring-teatro-blue/30 focus:border-teatro-blue"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
            style={{ backgroundColor: selectedEvent?.braceletColorHex || "#ffffff" }}
          />
          <div className="min-w-0 flex-1 truncate">
            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
              {selectedEvent ? selectedEvent.title : "Seleccionar función..."}
            </span>
          </div>
          {selectedEvent && (
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-3xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
              <Calendar className="w-2.5 h-2.5" />
              <span>{formatShortDate(selectedEvent.date)}</span>
              <span>•</span>
              <Clock className="w-2.5 h-2.5" />
              <span>{selectedEvent.time}</span>
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
            isOpen ? "rotate-180 text-teatro-blue" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-72 sm:max-h-80 overflow-y-auto bg-white dark:bg-[#0b1a30] rounded-xl border border-slate-200 dark:border-[#1e355b] shadow-xl py-1 divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in zoom-in-95 duration-100"
        >
          {events.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-slate-400">
              No hay eventos disponibles
            </div>
          ) : (
            events.map((evt) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <button
                  key={evt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectEventId(evt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-teatro-blue/10 dark:bg-teatro-blue/20 text-teatro-blue dark:text-blue-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#0f2442]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                      style={{ backgroundColor: evt.braceletColorHex || "#ffffff" }}
                    />
                    <div className="min-w-0 flex-1 truncate">
                      <p className="truncate font-medium">{evt.title}</p>
                      <p className="text-3xs text-slate-400 dark:text-slate-500 font-mono truncate">
                        {evt.genre || "Teatro Municipal"} • {evt.totalCapacity || 225} butacas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-3xs font-mono text-slate-400">
                    <span>{formatShortDate(evt.date)}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{evt.time}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
