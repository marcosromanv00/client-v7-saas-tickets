import { TheaterIncident, IncidentCategory, IncidentSeverity, IncidentStatus } from "./types";
import { logAuditEvent } from "../auth/audit-logger";

const INCIDENTS_STORAGE_KEY = "tm_theater_incidents_v1";

interface IncidentState {
  incidents: TheaterIncident[];
}

function loadInitialIncidents(): TheaterIncident[] {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error cargando incidencias", e);
    }
  }

  return [
    {
      id: "inc-sample-01",
      eventId: "evt-01",
      eventTitle: "Gran Reapertura Oficial",
      category: "ASIENTO_DUPLICADO",
      severity: "ALTA",
      status: "ABIERTA",
      locationZone: "Platea Baja",
      seatOrArea: "Platea B-04",
      affectedPersonName: "Juan Carlos Solano",
      affectedPersonId: "109880776",
      description: "Espectador indica que su butaca asignada está ocupada por otra persona con el mismo número impreso.",
      reportedBy: "Sofía (Acomodadora)",
      reportedByRole: "DELEGATED_ADMIN",
      reportedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: "inc-sample-02",
      eventId: "evt-01",
      eventTitle: "Gran Reapertura Oficial",
      category: "DISCREPANCIA_AFORO",
      severity: "MEDIA",
      status: "RESUELTA",
      locationZone: "Puerta Principal",
      seatOrArea: "Puerta Norte",
      affectedPersonName: "Mariana Rojas",
      description: "Brazalete con adhesivo dañado al momento de entrega en fila de acceso.",
      reportedBy: "Sofía (Acomodadora)",
      reportedByRole: "DELEGATED_ADMIN",
      reportedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      resolvedBy: "Marco (Superadmin)",
      resolutionNotes: "Se repuso brazalete oficial previa verificación de cédula en taquilla.",
    },
  ];
}

let state: IncidentState = {
  incidents: loadInitialIncidents(),
};

const listeners = new Set<() => void>();

function notify() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(state.incidents));
    } catch (e) {
      console.warn("Error persistiendo incidencias", e);
    }
  }
  listeners.forEach((l) => l());
}

export interface CreateIncidentPayload {
  eventId: string;
  eventTitle: string;
  title?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  locationZone: string;
  seatOrArea?: string;
  affectedPersonName?: string;
  affectedPersonId?: string;
  contactPhone?: string;
  description: string;
  reportedBy: string;
  reportedByRole: string;
}

export const incidentStore = {
  getSnapshot: (): IncidentState => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  createIncident: (payload: CreateIncidentPayload): TheaterIncident => {
    const newInc: TheaterIncident = {
      id: `inc-${Date.now()}`,
      status: "ABIERTA",
      reportedAt: new Date().toISOString(),
      ...payload,
    };

    state = { ...state, incidents: [newInc, ...state.incidents] };
    notify();

    logAuditEvent({
      actorId: payload.reportedBy,
      actorName: payload.reportedBy,
      actorRole: payload.reportedByRole === "SUPERADMIN" ? "SUPERADMIN" : "DELEGATED_ADMIN",
      action: "INCIDENT_REPORTED",
      targetEntity: newInc.id,
      details: `Incidencia reportada (${payload.category} - ${payload.severity}) en ${payload.locationZone}`,
      severity: payload.severity === "CRITICA" ? "CRITICAL" : payload.severity === "ALTA" ? "WARNING" : "INFO",
    });

    return newInc;
  },

  resolveIncident: (incidentId: string, resolutionNotes: string, resolvedBy: string): TheaterIncident | null => {
    const target = state.incidents.find((i) => i.id === incidentId);
    if (!target) return null;

    const updated: TheaterIncident = {
      ...target,
      status: "RESUELTA",
      resolvedAt: new Date().toISOString(),
      resolvedBy,
      resolutionNotes,
    };

    state = {
      ...state,
      incidents: state.incidents.map((i) => (i.id === incidentId ? updated : i)),
    };
    notify();

    logAuditEvent({
      actorId: resolvedBy,
      actorName: resolvedBy,
      actorRole: "SUPERADMIN",
      action: "INCIDENT_RESOLVED",
      targetEntity: incidentId,
      details: `Incidencia ${incidentId} marcada como resuelta. Solución: ${resolutionNotes}`,
      severity: "INFO",
    });

    return updated;
  },

  updateStatus: (incidentId: string, status: IncidentStatus): boolean => {
    const exists = state.incidents.some((i) => i.id === incidentId);
    if (!exists) return false;

    state = {
      ...state,
      incidents: state.incidents.map((i) => (i.id === incidentId ? { ...i, status } : i)),
    };
    notify();
    return true;
  },

  deleteIncident: (incidentId: string): boolean => {
    const countBefore = state.incidents.length;
    state = {
      ...state,
      incidents: state.incidents.filter((i) => i.id !== incidentId),
    };
    notify();
    return state.incidents.length < countBefore;
  },

  resetStore: () => {
    state = { incidents: loadInitialIncidents() };
    notify();
  },
};
