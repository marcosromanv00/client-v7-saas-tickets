import { AuditLogEntry, AuditAction, AuditSeverity, UserRole } from "./types";

const AUDIT_STORAGE_KEY = "tm_audit_logs_v1";

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-init-01",
    timestamp: "2026-09-23T12:00:00.000Z",
    actorId: "usr-superadmin-01",
    actorName: "Marco (Superadmin)",
    actorRole: "SUPERADMIN",
    action: "EVENT_CONFIG_UPDATED",
    targetEntity: "evt-gala-inaugural-25",
    details: "Inicialización del sistema de tiquetería y configuración de aforo 190 butacas.",
    severity: "INFO",
  },
  {
    id: "log-init-02",
    timestamp: "2026-09-23T14:30:00.000Z",
    actorId: "usr-producer-01",
    actorName: "Productora General",
    actorRole: "PRODUCER",
    action: "VIP_INVITE_ISSUED",
    targetEntity: "PB-A-06",
    details: "Precarga de invitación protocolaria para Despacho de Alcaldía en Fila A.",
    severity: "INFO",
  },
];

function loadAuditLogs(): AuditLogEntry[] {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading audit logs", e);
    }
  }
  return INITIAL_AUDIT_LOGS;
}

let auditLogs: AuditLogEntry[] = loadAuditLogs();
const listeners = new Set<() => void>();

function persistAndNotify() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn("Error writing audit logs", e);
    }
  }
  listeners.forEach((l) => l());
}

export function logAuditEvent(entry: {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  targetEntity: string;
  details: string;
  severity?: AuditSeverity;
}): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    severity: entry.severity || "INFO",
    ...entry,
  };

  auditLogs = [newEntry, ...auditLogs];
  persistAndNotify();
  return newEntry;
}

export const auditLogStore = {
  getSnapshot: (): AuditLogEntry[] => auditLogs,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  clearLogs: (actorName: string) => {
    auditLogs = [];
    persistAndNotify();
    logAuditEvent({
      actorId: "system",
      actorName,
      actorRole: "SUPERADMIN",
      action: "EVENT_CONFIG_UPDATED",
      targetEntity: "AUDIT_STORE",
      details: `Historial de auditoría purgado por ${actorName}`,
      severity: "CRITICAL",
    });
  },
};
