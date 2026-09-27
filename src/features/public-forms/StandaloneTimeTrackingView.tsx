import React, { useState, useMemo } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { useStaffTimeStore } from "../staff/useStaffTimeStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { StaffDuty } from "../staff/types";
import { getDefaultActiveEventId } from "../tickets/event-date-utils";
import { StandaloneTimeTrackingForm } from "./StandaloneTimeTrackingForm";
import { StandaloneTimeLogsList } from "./StandaloneTimeLogsList";

function getCurrentTimeStr(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export const StandaloneTimeTrackingView: React.FC = () => {
  const store = useTheaterStore();
  const { entries, recordDirectEntry, clockOutById } = useStaffTimeStore();

  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const activeEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];

  const defaultDate = activeEvent?.date || new Date().toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState(defaultDate);
  const [staffName, setStaffName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [duty, setDuty] = useState<StaffDuty>("PUERTA");
  const [clockIn, setClockIn] = useState(getCurrentTimeStr);
  const [clockOut, setClockOut] = useState("");
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEventChange = (evtId: string) => {
    setSelectedEventId(evtId);
    const evt = store.events.find((e) => e.id === evtId);
    if (evt?.date) setEventDate(evt.date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !citizenId.trim()) return;

    recordDirectEntry({
      staffName: staffName.trim(),
      staffCitizenId: citizenId.trim(),
      duty,
      eventId: activeEvent?.id || "evt-gen",
      eventTitle: activeEvent?.title || "Función Teatral",
      clockIn: `${eventDate}T${clockIn}:00.000Z`,
      clockOut: clockOut.trim() ? `${eventDate}T${clockOut}:00.000Z` : undefined,
      notes: notes.trim() || undefined,
    });

    setSuccessMsg(`Registro guardado con éxito para ${staffName.trim()}.`);
    setNotes("");
    setClockOut("");
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  const todayEntries = useMemo(() => entries.slice(0, 10), [entries]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teatro-navy text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teatro-blue-light dark:bg-teatro-blue/20 text-teatro-blue dark:text-blue-400 flex items-center justify-center border border-teatro-blue/20">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
            Registro de Jornada • Colaboradores
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Teatro Municipal de Alajuela • Formulario Oficial de Entrada y Salida
          </p>
        </header>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <StandaloneTimeTrackingForm
          events={store.events}
          selectedEventId={selectedEventId}
          onEventChange={handleEventChange}
          eventDate={eventDate}
          onEventDateChange={setEventDate}
          staffName={staffName}
          onStaffNameChange={setStaffName}
          citizenId={citizenId}
          onCitizenIdChange={setCitizenId}
          duty={duty}
          onDutyChange={setDuty}
          clockIn={clockIn}
          onClockInChange={setClockIn}
          clockOut={clockOut}
          onClockOutChange={setClockOut}
          notes={notes}
          onNotesChange={setNotes}
          onSubmit={handleSubmit}
        />

        <StandaloneTimeLogsList entries={todayEntries} onClockOut={(id) => clockOutById(id)} />
      </div>
    </div>
  );
};
