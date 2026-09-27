import { UserAccount, UserRole } from "./types";
import { logAuditEvent } from "./audit-logger";

export function createAdminUserPure(
  users: UserAccount[],
  payload: { name: string; email: string; passwordPlain: string; role?: UserRole },
  actorId = "usr-superadmin-01"
): { success: boolean; users: UserAccount[]; user?: UserAccount; error?: string } {
  const normEmail = payload.email.toLowerCase().trim();
  if (users.some((u) => u.email.toLowerCase().trim() === normEmail)) {
    return { success: false, users, error: "Ya existe un usuario con este correo electrónico." };
  }

  const newUser: UserAccount = {
    id: `usr-admin-${Date.now()}`,
    name: payload.name.trim(),
    email: normEmail,
    role: payload.role || "DELEGATED_ADMIN",
    passwordHash: payload.passwordPlain,
    createdAt: new Date().toISOString(),
    createdBy: actorId,
    active: true,
    approvalStatus: "APPROVED",
    assignedDuty: "GENERAL",
    notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 24 },
  };

  logAuditEvent({
    actorId,
    actorName: "Marco (Superadmin)",
    actorRole: "SUPERADMIN",
    action: "ADMIN_CREATED",
    targetEntity: newUser.id,
    details: `Administrador creado: ${newUser.name} (${newUser.role})`,
    severity: "INFO",
  });

  return { success: true, users: [...users, newUser], user: newUser };
}

export function deleteAdminUserPure(
  users: UserAccount[],
  adminId: string,
  actorId = "usr-superadmin-01"
): { success: boolean; users: UserAccount[]; error?: string } {
  const target = users.find((u) => u.id === adminId);
  if (!target) return { success: false, users, error: "Usuario no encontrado." };
  if (target.role === "SUPERADMIN") return { success: false, users, error: "No se puede eliminar la cuenta del Superadmin." };

  logAuditEvent({
    actorId,
    actorName: "Marco (Superadmin)",
    actorRole: "SUPERADMIN",
    action: "ADMIN_DELETED",
    targetEntity: adminId,
    details: `Administrador eliminado: ${target.name} (${target.email})`,
    severity: "WARNING",
  });

  return { success: true, users: users.filter((u) => u.id !== adminId) };
}

export function registerCitizenPure(
  users: UserAccount[],
  payload: { name: string; email: string; citizenId: string; phone?: string; passwordPlain: string }
): { success: boolean; users: UserAccount[]; user?: UserAccount; error?: string } {
  const normEmail = payload.email.toLowerCase().trim();
  const normCitizen = payload.citizenId.trim();

  if (users.some((u) => u.email.toLowerCase().trim() === normEmail || (u.citizenId && u.citizenId.trim() === normCitizen))) {
    return { success: false, users, error: "Ya existe una cuenta con este correo o cédula." };
  }

  const newCitizen: UserAccount = {
    id: `usr-cit-${Date.now()}`,
    name: payload.name.trim(),
    email: normEmail,
    citizenId: normCitizen,
    phone: payload.phone?.trim(),
    role: "CITIZEN",
    passwordHash: payload.passwordPlain,
    createdAt: new Date().toISOString(),
    active: true,
    approvalStatus: "APPROVED",
    assignedDuty: "GENERAL",
    notifications: { email: true, sms: false, whatsapp: true, reminderHoursBefore: 24 },
  };

  return { success: true, users: [...users, newCitizen], user: newCitizen };
}
