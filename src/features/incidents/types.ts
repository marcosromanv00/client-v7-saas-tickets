import { z } from "zod";

export const IncidentCategorySchema = z.enum([
  "GOTERA_FILTRACION",
  "ROTURA_MOBILIARIO",
  "FALTANTE_EQUIPO",
  "ILUMINACION_ELECTRICO",
  "LIMPIEZA_ASEO",
  "INFRAESTRUCTURA_BUTACA",
  "ASIENTO_DUPLICADO",
  "BOLETO_EXTRAVIADO",
  "DISCREPANCIA_AFORO",
  "ASISTENCIA_ESPECIAL",
  "CONDUCTA_SEGURIDAD",
  "OTRO",
]);
export type IncidentCategory = z.infer<typeof IncidentCategorySchema>;

export const IncidentCategoryLabels: Record<IncidentCategory, { label: string; icon: string }> = {
  GOTERA_FILTRACION: { label: "Gotera o Filtración de Agua", icon: "Droplets" },
  ROTURA_MOBILIARIO: { label: "Cosa o Mobiliario Roto / Dañado", icon: "Hammer" },
  FALTANTE_EQUIPO: { label: "Faltante de Equipo o Insumo", icon: "PackageSearch" },
  ILUMINACION_ELECTRICO: { label: "Falla Eléctrica / Iluminación", icon: "Zap" },
  LIMPIEZA_ASEO: { label: "Aseo / Limpieza Requerida", icon: "Sparkles" },
  INFRAESTRUCTURA_BUTACA: { label: "Falla de Butaca o Sala", icon: "AlertTriangle" },
  ASIENTO_DUPLICADO: { label: "Asiento Duplicado / Disputa", icon: "Armchair" },
  BOLETO_EXTRAVIADO: { label: "Boleto Extraviado / No Encontrado", icon: "Ticket" },
  DISCREPANCIA_AFORO: { label: "Discrepancia de Aforo / Brazalete Dañado", icon: "Tag" },
  ASISTENCIA_ESPECIAL: { label: "Asistencia Médica / Movilidad", icon: "HeartPulse" },
  CONDUCTA_SEGURIDAD: { label: "Orden y Seguridad", icon: "ShieldAlert" },
  OTRO: { label: "Otra Incidencia / Problema", icon: "FileText" },
};

export const IncidentSeveritySchema = z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]);
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>;

export const IncidentSeverityConfig: Record<
  IncidentSeverity,
  { label: string; badgeClass: string; borderClass: string }
> = {
  BAJA: {
    label: "Baja",
    badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300",
    borderClass: "border-slate-300 dark:border-slate-700",
  },
  MEDIA: {
    label: "Media",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    borderClass: "border-amber-400 dark:border-amber-600",
  },
  ALTA: {
    label: "Alta",
    badgeClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    borderClass: "border-orange-500 dark:border-orange-600",
  },
  CRITICA: {
    label: "Crítica",
    badgeClass: "bg-red-500/20 text-muni-red dark:text-red-300 border-red-500/40 animate-pulse",
    borderClass: "border-red-500 dark:border-red-600",
  },
};

export const IncidentStatusSchema = z.enum(["ABIERTA", "EN_PROCESO", "RESUELTA"]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export const TheaterIncidentSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventTitle: z.string(),
  title: z.string().optional(),
  category: IncidentCategorySchema,
  severity: IncidentSeveritySchema,
  status: IncidentStatusSchema.default("ABIERTA"),
  locationZone: z.string(),
  seatOrArea: z.string().optional(),
  affectedPersonName: z.string().optional(),
  affectedPersonId: z.string().optional(),
  contactPhone: z.string().optional(),
  description: z.string().min(3),
  reportedBy: z.string(),
  reportedByRole: z.string(),
  reportedAt: z.string(),
  resolvedAt: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolutionNotes: z.string().optional(),
});
export type TheaterIncident = z.infer<typeof TheaterIncidentSchema>;
