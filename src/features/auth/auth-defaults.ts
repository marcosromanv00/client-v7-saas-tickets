import { UserAccount } from "./types";

export const USERS_STORAGE_KEY = "tm_auth_users_v2";
export const SESSION_STORAGE_KEY = "tm_auth_session_v2";

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: "usr-superadmin-01",
    name: "Marco (Superadmin)",
    email: "marco@teatromunicipal.cr",
    role: "SUPERADMIN",
    citizenId: "305290253",
    approvalStatus: "APPROVED",
    assignedDuty: "GENERAL",
    passwordHash: "admin2026",
    createdAt: "2026-09-01T00:00:00Z",
    active: true,
    notifications: { email: true, sms: false, whatsapp: true, reminderHoursBefore: 24 },
  },
  {
    id: "usr-producer-01",
    name: "Productora General",
    email: "productora@teatromunicipal.cr",
    role: "PRODUCER",
    citizenId: "115200340",
    approvalStatus: "APPROVED",
    assignedDuty: "GENERAL",
    passwordHash: "teatro2026",
    createdAt: "2026-09-05T00:00:00Z",
    active: true,
    notifications: { email: true, sms: true, whatsapp: true, reminderHoursBefore: 24 },
  },
  {
    id: "usr-staff-01",
    name: "Sofía (Acomodadora Puerta)",
    email: "sofia@teatromunicipal.cr",
    role: "DELEGATED_ADMIN",
    citizenId: "207890123",
    approvalStatus: "APPROVED",
    assignedDuty: "PUERTA",
    passwordHash: "staff2026",
    createdAt: "2026-09-10T00:00:00Z",
    createdBy: "usr-superadmin-01",
    active: true,
    notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 12 },
  },
  {
    id: "usr-staff-pending-01",
    name: "Esteban Mora Vega",
    email: "esteban@teatromunicipal.cr",
    role: "DELEGATED_ADMIN",
    citizenId: "208120456",
    approvalStatus: "PENDING_APPROVAL",
    assignedDuty: "SALA",
    passwordHash: "staff2026",
    createdAt: "2026-09-26T18:00:00Z",
    active: true,
    notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 12 },
  },
];

export function loadStoredUsers(): UserAccount[] {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading users", e);
    }
  }
  return DEFAULT_USERS;
}

export function loadStoredSession(): UserAccount | null {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading session", e);
    }
  }
  return null;
}
