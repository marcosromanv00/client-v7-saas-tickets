import React, { useState, useEffect } from "react";
import { Clock, Play, Square, Shield } from "lucide-react";
import { useStaffTimeStore } from "./useStaffTimeStore";
import { useAuthStore } from "../auth/useAuthStore";
import { StaffDutyInfo, StaffDuty } from "./types";
import { computeWorkedMinutes, formatMinutesToHours } from "./staff-time-store";
import { TheaterEvent } from "../tickets/types";

interface StaffClockInOutCardProps {
  currentEvent: TheaterEvent;
}

export const StaffClockInOutCard: React.FC<StaffClockInOutCardProps> = ({ currentEvent }) => {
  const { currentUser } = useAuthStore();
  const { entries, getActiveShift, clockIn, clockOut } = useStaffTimeStore();
  const [notes, setNotes] = useState("");
  const [elapsedMins, setElapsedMins] = useState(0);

  const activeShift = currentUser ? getActiveShift(currentUser.id) : undefined;
  const currentDuty = (currentUser?.assignedDuty || "GENERAL") as StaffDuty;
  const dutyMeta = StaffDutyInfo[currentDuty] || StaffDutyInfo.GENERAL;

  // Actualización en vivo del tiempo laborado
  useEffect(() => {
    if (!activeShift) {
      setElapsedMins(0);
      return;
    }
    const update = () => {
      setElapsedMins(computeWorkedMinutes(activeShift.clockIn));
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, [activeShift]);

  if (!currentUser) return null;

  const handleClockIn = () => {
    clockIn(currentUser, currentEvent.id, currentEvent.title, currentDuty);
  };

  const handleClockOut = () => {
    clockOut(currentUser.id, notes.trim() || undefined);
    setNotes("");
  };

  const userEntries = entries.filter((e) => e.staffId === currentUser.id).slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teatro-blue dark:text-blue-400 font-semibold">
              Control de Jornada & Asistencia
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${dutyMeta.badgeClass}`}>
              {dutyMeta.name}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Registro de Horario • {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cédula: <strong className="font-mono">{currentUser.citizenId || "N/A"}</strong> • Puesto asignado por Superadmin: {dutyMeta.shortName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeShift ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Turno Activo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              Fuera de Turno
            </span>
          )}
        </div>
      </div>

      {activeShift ? (
        <div className="bg-emerald-50/50 dark:bg-[#07172b] border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold block">
                  Tiempo en servicio activo
                </span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatMinutesToHours(elapsedMins)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Entrada: {new Date(activeShift.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {activeShift.eventTitle}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones de salida (opcional)..."
                className="px-3 py-2 bg-white dark:bg-[#0a1b32] border border-slate-200 dark:border-[#1d3860] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleClockOut}
                className="px-4 py-2 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" /> Registrar Salida
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-2xl bg-teatro-blue text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Iniciar Jornada Laboral</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Se registrará tu entrada para la función: <strong>{currentEvent.title}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClockIn}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> Registrar Entrada (Clock In)
          </button>
        </div>
      )}

      {userEntries.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Últimos registros de jornada
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {userEntries.map((e) => (
              <div key={e.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{new Date(e.clockIn).toLocaleDateString()}</span>
                  <span className="font-mono font-bold text-teatro-blue dark:text-blue-400">
                    {e.totalMinutes ? formatMinutesToHours(e.totalMinutes) : "En curso"}
                  </span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {e.eventTitle}
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(e.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {e.clockOut && ` - ${new Date(e.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
