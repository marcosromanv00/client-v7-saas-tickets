import { UserAccount } from "../auth/types";
import { StaffDuty } from "./types";
import { logAuditEvent } from "../auth/audit-logger";

export interface RegisterStaffPayload {
  name: string;
  email: string;
  citizenId: string;
  phone?: string;
  passwordPlain: string;
  requestedDuty?: StaffDuty;
}

export function registerStaffPure(
  users: UserAccount[],
  payload: RegisterStaffPayload
): { success: boolean; users: UserAccount[]; user?: UserAccount; error?: string } {
  const normEmail = payload.email.toLowerCase().trim();
  const normCitizen = payload.citizenId.trim();

  const exists = users.some(
    (u) =>
      u.email.toLowerCase().trim() === normEmail ||
      (u.citizenId && u.citizenId.trim() === normCitizen)
  );

  if (exists) {
    return { success: false, users, error: "Ya existe un usuario con este correo o cédula." };
  }

  const newStaff: UserAccount = {
    id: `usr-staff-${Date.now()}`,
    name: payload.name.trim(),
    email: normEmail,
    citizenId: normCitizen,
    phone: payload.phone?.trim(),
    role: "DELEGATED_ADMIN",
    approvalStatus: "PENDING_APPROVAL",
    assignedDuty: payload.requestedDuty || "GENERAL",
    passwordHash: payload.passwordPlain,
    createdAt: new Date().toISOString(),
    active: true,
    notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 24 },
  };

  logAuditEvent({
    actorId: newStaff.id,
    actorName: newStaff.name,
    actorRole: "DELEGATED_ADMIN",
    action: "STAFF_REGISTERED",
    targetEntity: newStaff.id,
    details: `Solicitud de staff registrada con cédula ${normCitizen}. Estado: PENDIENTE DE APROBACIÓN`,
    severity: "INFO",
  });

  return { success: true, users: [...users, newStaff], user: newStaff };
}

export function approveStaffPure(
  users: UserAccount[],
  staffId: string,
  initialDuty: StaffDuty = "PUERTA",
  actorId = "usr-superadmin-01",
  actorName = "Marco (Superadmin)"
): { success: boolean; users: UserAccount[]; error?: string } {
  const target = users.find((u) => u.id === staffId);
  if (!target) return { success: false, users, error: "Personal no encontrado." };

  const updatedUsers = users.map((u) =>
    u.id === staffId ? { ...u, approvalStatus: "APPROVED" as const, assignedDuty: initialDuty, active: true } : u
  );

  logAuditEvent({
    actorId,
    actorName,
    actorRole: "SUPERADMIN",
    action: "STAFF_APPROVED",
    targetEntity: staffId,
    details: `Staff ${target.name} (Cédula: ${target.citizenId}) aprobado con puesto: ${initialDuty}`,
    severity: "INFO",
  });

  return { success: true, users: updatedUsers };
}

export function rejectStaffPure(
  users: UserAccount[],
  staffId: string,
  actorId = "usr-superadmin-01",
  actorName = "Marco (Superadmin)"
): { success: boolean; users: UserAccount[]; error?: string } {
  const target = users.find((u) => u.id === staffId);
  if (!target) return { success: false, users, error: "Personal no encontrado." };

  const updatedUsers = users.map((u) =>
    u.id === staffId ? { ...u, approvalStatus: "REJECTED" as const, active: false } : u
  );

  logAuditEvent({
    actorId,
    actorName,
    actorRole: "SUPERADMIN",
    action: "STAFF_REJECTED",
    targetEntity: staffId,
    details: `Solicitud de staff rechazada para ${target.name}`,
    severity: "WARNING",
  });

  return { success: true, users: updatedUsers };
}

export function assignDutyPure(
  users: UserAccount[],
  staffId: string,
  duty: StaffDuty,
  actorId = "usr-superadmin-01",
  actorName = "Marco (Superadmin)"
): { success: boolean; users: UserAccount[]; error?: string } {
  const target = users.find((u) => u.id === staffId);
  if (!target) return { success: false, users, error: "Personal no encontrado." };

  const updatedUsers = users.map((u) =>
    u.id === staffId ? { ...u, assignedDuty: duty } : u
  );

  logAuditEvent({
    actorId,
    actorName,
    actorRole: "SUPERADMIN",
    action: "STAFF_DUTY_CHANGED",
    targetEntity: staffId,
    details: `Reasignación de puesto en caliente: ${target.name} ahora asignado a ${duty}`,
    severity: "INFO",
  });

  return { success: true, users: updatedUsers };
}
