import React from "react";
import { Send, User, Phone, MapPin } from "lucide-react";
import {
  INCIDENT_REPORT_CATEGORIES,
  THEATER_ZONES,
  INCIDENT_SEVERITIES,
  StandaloneIncidentReportFormProps,
} from "./standalone-incident.constants";

export const StandaloneIncidentReportForm: React.FC<StandaloneIncidentReportFormProps> = ({
  title,
  onTitleChange,
  category,
  onCategoryChange,
  severity,
  onSeverityChange,
  locationZone,
  onLocationZoneChange,
  locationDetail,
  onLocationDetailChange,
  reportedBy,
  onReportedByChange,
  contactPhone,
  onContactPhoneChange,
  description,
  onDescriptionChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border p-5 sm:p-7 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Título o Resumen de la Incidencia
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ej. Gotera sobre fila E en Balcón o Butaca B-04 rota..."
          className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Tipo de Problema o Daño
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INCIDENT_REPORT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategoryChange(c.id)}
              className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                category === c.id
                  ? "bg-teatro-blue text-white border-teatro-blue shadow-xs"
                  : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-sm shrink-0">{c.icon}</span>
              <span className="truncate leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Nivel de Urgencia
        </label>
        <div className="grid grid-cols-3 gap-2">
          {INCIDENT_SEVERITIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeverityChange(s.id)}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                severity === s.id
                  ? s.id === "CRITICA"
                    ? "bg-muni-red text-white border-muni-red shadow-xs font-bold"
                    : "bg-teatro-blue text-white border-teatro-blue shadow-xs"
                  : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-[#1a3357] text-slate-700 dark:text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Zona de la Sala / Teatro
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={locationZone}
              onChange={(e) => onLocationZoneChange(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              {THEATER_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Detalle Específico de Ubicación
          </label>
          <input
            type="text"
            value={locationDetail}
            onChange={(e) => onLocationDetailChange(e.target.value)}
            placeholder="Ej. Fila C asiento 4, pared izquierda..."
            className="w-full px-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            ¿Quién reporta? (Nombre)
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => onReportedByChange(e.target.value)}
              placeholder="Ej. Sofía Valverde"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Teléfono de Contacto (Opcional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => onContactPhoneChange(e.target.value)}
              placeholder="Ej. 8492-3925"
              className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Descripción Detallada del Problema
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describa qué pasa, si gotea agua, si está roto o qué hace falta para la función..."
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-[48px] py-3.5 rounded-2xl bg-muni-red hover:bg-muni-red-hover text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Enviar Reporte de Incidencia</span>
      </button>
    </form>
  );
};
