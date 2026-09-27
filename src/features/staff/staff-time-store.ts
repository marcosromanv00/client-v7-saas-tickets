import { StaffTimeEntry, StaffDuty } from "./types";
import { UserAccount } from "../auth/types";
import { logAuditEvent } from "../auth/audit-logger";

const STAFF_TIME_STORAGE_KEY = "tm_staff_time_entries_v1";

interface StaffTimeState {
  entries: StaffTimeEntry[];
}

function loadInitialEntries(): StaffTimeEntry[] {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(STAFF_TIME_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error cargando marcas de tiempo de staff", e);
    }
  }
  return [
    {
      id: "shift-sample-01",
      staffId: "usr-staff-01",
      staffName: "Sofía (Acomodadora Puerta)",
      staffCitizenId: "207890123",
      eventId: "evt-01",
      eventTitle: "Gran Reapertura Oficial",
      assignedDuty: "PUERTA",
      clockIn: new Date(Date.now() - 1000 * 60 * 135).toISOString(), // 2h 15m ago
      notes: "Apertura de accesos puerta norte",
    },
  ];
}

let state: StaffTimeState = {
  entries: loadInitialEntries(),
};

const listeners = new Set<() => void>();

function notify() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STAFF_TIME_STORAGE_KEY, JSON.stringify(state.entries));
    } catch (e) {
      console.warn("Error guardando marcas de staff", e);
    }
  }
  listeners.forEach((l) => l());
}

export function computeWorkedMinutes(clockInIso: string, clockOutIso?: string): number {
  const start = new Date(clockInIso).getTime();
  const end = clockOutIso ? new Date(clockOutIso).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);
  return Math.floor(diffMs / (1000 * 60));
}

export function formatMinutesToHours(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

export const staffTimeStore = {
  getSnapshot: (): StaffTimeState => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getActiveShift: (staffId: string): StaffTimeEntry | undefined => {
    return state.entries.find((e) => e.staffId === staffId && !e.clockOut);
  },

  clockIn: (staff: UserAccount, eventId: string, eventTitle: string, duty?: StaffDuty): StaffTimeEntry => {
    const active = state.entries.find((e) => e.staffId === staff.id && !e.clockOut);
    if (active) return active;

    const newEntry: StaffTimeEntry = {
      id: `shift-${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      staffCitizenId: staff.citizenId || "N/A",
      eventId,
      eventTitle,
      assignedDuty: duty || staff.assignedDuty || "GENERAL",
      clockIn: new Date().toISOString(),
    };

    state = { ...state, entries: [newEntry, ...state.entries] };
    notify();

    logAuditEvent({
      actorId: staff.id,
      actorName: staff.name,
      actorRole: staff.role,
      action: "STAFF_CLOCK_IN",
      targetEntity: newEntry.id,
      details: `Entrada registrada para ${staff.name} en puesto ${newEntry.assignedDuty} (${eventTitle})`,
      severity: "INFO",
    });

    return newEntry;
  },

  clockOut: (staffId: string, notes?: string): StaffTimeEntry | null => {
    const shift = state.entries.find((e) => e.staffId === staffId && !e.clockOut);
    if (!shift) return null;

    const clockOut = new Date().toISOString();
    const totalMinutes = computeWorkedMinutes(shift.clockIn, clockOut);

    const updated: StaffTimeEntry = {
      ...shift,
      clockOut,
      totalMinutes,
      notes: notes || shift.notes,
    };

    state = {
      ...state,
      entries: state.entries.map((e) => (e.id === shift.id ? updated : e)),
    };
    notify();

    logAuditEvent({
      actorId: shift.staffId,
      actorName: shift.staffName,
      actorRole: "DELEGATED_ADMIN",
      action: "STAFF_CLOCK_OUT",
      targetEntity: shift.id,
      details: `Salida registrada para ${shift.staffName}. Total laborado: ${formatMinutesToHours(totalMinutes)}`,
      severity: "INFO",
    });

    return updated;
  },

  recordDirectEntry: (payload: {
    staffName: string;
    staffCitizenId: string;
    duty: StaffDuty;
    eventId: string;
    eventTitle: string;
    clockIn: string;
    clockOut?: string;
    notes?: string;
  }): StaffTimeEntry => {
    const totalMinutes = payload.clockOut ? computeWorkedMinutes(payload.clockIn, payload.clockOut) : undefined;
    const newEntry: StaffTimeEntry = {
      id: `shift-${Date.now()}`,
      staffId: `direct-${payload.staffCitizenId.replace(/\D/g, "") || Date.now()}`,
      staffName: payload.staffName,
      staffCitizenId: payload.staffCitizenId,
      eventId: payload.eventId,
      eventTitle: payload.eventTitle,
      assignedDuty: payload.duty,
      clockIn: payload.clockIn,
      clockOut: payload.clockOut,
      totalMinutes,
      notes: payload.notes,
    };
    state = { ...state, entries: [newEntry, ...state.entries] };
    notify();
    return newEntry;
  },

  clockOutById: (entryId: string, clockOutIso?: string, notes?: string): StaffTimeEntry | null => {
    const shift = state.entries.find((e) => e.id === entryId);
    if (!shift) return null;
    const clockOut = clockOutIso || new Date().toISOString();
    const totalMinutes = computeWorkedMinutes(shift.clockIn, clockOut);
    const updated: StaffTimeEntry = {
      ...shift,
      clockOut,
      totalMinutes,
      notes: notes || shift.notes,
    };
    state = {
      ...state,
      entries: state.entries.map((e) => (e.id === entryId ? updated : e)),
    };
    notify();
    return updated;
  },

  resetStore: () => {
    state = { entries: loadInitialEntries() };
    notify();
  },
};
