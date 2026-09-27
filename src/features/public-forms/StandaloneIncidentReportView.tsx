import React, { useState, useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useIncidentStore } from "../incidents/useIncidentStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { IncidentCategory, IncidentSeverity } from "../incidents/types";
import { getDefaultActiveEventId } from "../tickets/event-date-utils";
import { StandaloneIncidentReportForm } from "./StandaloneIncidentReportForm";

export const StandaloneIncidentReportView: React.FC = () => {
  const { incidents, createIncident } = useIncidentStore();
  const theaterStore = useTheaterStore();

  const currentEvent =
    theaterStore.events.find((e) => e.id === getDefaultActiveEventId(theaterStore.events)) ||
    theaterStore.events[0];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("GOTERA_FILTRACION");
  const [severity, setSeverity] = useState<IncidentSeverity>("MEDIA");
  const [locationZone, setLocationZone] = useState("Platea Baja");
  const [locationDetail, setLocationDetail] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !reportedBy.trim()) return;

    createIncident({
      eventId: currentEvent?.id || "evt-gen",
      eventTitle: currentEvent?.title || "Función Teatral",
      title: title.trim(),
      category,
      severity,
      locationZone: locationZone.trim(),
      seatOrArea: locationDetail.trim() || undefined,
      description: description.trim(),
      reportedBy: reportedBy.trim(),
      reportedByRole: "REPORTE_PUBLICO",
      contactPhone: contactPhone.trim() || undefined,
    });

    setSuccessMsg("Incidencia registrada con éxito. El equipo técnico ha sido notificado.");
    setTitle("");
    setDescription("");
    setLocationDetail("");
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const openIncidents = useMemo(() => {
    return incidents.filter((i) => i.status !== "RESUELTA").slice(0, 5);
  }, [incidents]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teatro-navy text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-muni-red dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/40">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
            Reporte Rápido de Incidencias
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Teatro Municipal de Alajuela • Notifique goteras, roturas, faltantes o desperfectos en sala
          </p>
        </header>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <StandaloneIncidentReportForm
          title={title}
          onTitleChange={setTitle}
          category={category}
          onCategoryChange={setCategory}
          severity={severity}
          onSeverityChange={setSeverity}
          locationZone={locationZone}
          onLocationZoneChange={setLocationZone}
          locationDetail={locationDetail}
          onLocationDetailChange={setLocationDetail}
          reportedBy={reportedBy}
          onReportedByChange={setReportedBy}
          contactPhone={contactPhone}
          onContactPhoneChange={setContactPhone}
          description={description}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
        />

        {openIncidents.length > 0 && (
          <section className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Incidencias en Atención en Sala ({openIncidents.length})
            </h2>
            <div className="space-y-2">
              {openIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {inc.title || inc.description.slice(0, 40)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    📍 {inc.locationZone} {inc.seatOrArea ? `(${inc.seatOrArea})` : ""} • Reportado por {inc.reportedBy}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
