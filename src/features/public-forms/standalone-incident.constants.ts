import { IncidentCategory } from "../incidents/types";

export const INCIDENT_REPORT_CATEGORIES: { id: IncidentCategory; label: string; icon: string }[] = [
  { id: "GOTERA_FILTRACION", label: "Gotera / Filtración", icon: "💧" },
  { id: "ROTURA_MOBILIARIO", label: "Cosa / Butaca Rota", icon: "🪑" },
  { id: "FALTANTE_EQUIPO", label: "Faltante de Equipo", icon: "📦" },
  { id: "ILUMINACION_ELECTRICO", label: "Luces / Electricidad", icon: "💡" },
  { id: "LIMPIEZA_ASEO", label: "Limpieza / Aseo", icon: "🧹" },
  { id: "INFRAESTRUCTURA_BUTACA", label: "Falla de Sala", icon: "⚠️" },
  { id: "ASISTENCIA_ESPECIAL", label: "Asistencia Médica", icon: "🩺" },
  { id: "OTRO", label: "Otro Problema", icon: "📋" },
];

export const THEATER_ZONES: string[] = [
  "Platea Baja (Nivel 1)",
  "Nivel Medio (Nivel 2)",
  "Balcón Superior (Nivel 3)",
  "Escenario / Proscenio",
  "Cabina de Audio / Luces",
  "Lobby / Pasillos de Acceso",
  "Baños Públicos",
  "Camerinos",
  "Taquilla / Puerta de Acceso",
  "Otra Zona",
];

export const INCIDENT_SEVERITIES = [
  { id: "BAJA", label: "Baja (Post-función)" },
  { id: "MEDIA", label: "Media (Intermedio)" },
  { id: "CRITICA", label: "Crítica (Urgente)" },
] as const;

export interface StandaloneIncidentReportFormProps {
  title: string;
  onTitleChange: (v: string) => void;
  category: IncidentCategory;
  onCategoryChange: (v: IncidentCategory) => void;
  severity: import("../incidents/types").IncidentSeverity;
  onSeverityChange: (v: import("../incidents/types").IncidentSeverity) => void;
  locationZone: string;
  onLocationZoneChange: (v: string) => void;
  locationDetail: string;
  onLocationDetailChange: (v: string) => void;
  reportedBy: string;
  onReportedByChange: (v: string) => void;
  contactPhone: string;
  onContactPhoneChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
