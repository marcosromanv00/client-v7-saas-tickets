import { UserAccount, UserRole, NotificationPrefs } from "./types";
import { logAuditEvent } from "./audit-logger";
import {
  USERS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  loadStoredUsers,
  loadStoredSession,
} from "./auth-defaults";

interface AuthState {
  users: UserAccount[];
  currentUser: UserAccount | null;
}

let state: AuthState = {
  users: loadStoredUsers(),
  currentUser: loadStoredSession(),
};

const listeners = new Set<() => void>();

function notify() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.users));
      if (state.currentUser) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.currentUser));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Error persisting auth", e);
    }
  }
  listeners.forEach((l) => l());
}

export const authStore = {
  getSnapshot: (): AuthState => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  login: (email: string, passwordPlain: string): { success: boolean; user?: UserAccount; error?: string } => {
    const user = state.users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (!user || user.passwordHash !== passwordPlain) {
      logAuditEvent({
        actorId: "anonymous",
        actorName: email || "Desconocido",
        actorRole: "CITIZEN",
        action: "AUTH_LOGIN",
        targetEntity: email,
        details: "Intento fallido de inicio de sesión (credenciales erróneas)",
        severity: "WARNING",
      });
      return { success: false, error: "Credenciales inválidas. Compruebe correo y contraseña." };
    }
    if (!user.active) {
      return { success: false, error: "Esta cuenta se encuentra inactiva. Contacte al Superadmin." };
    }

    state = { ...state, currentUser: user };
    notify();
    logAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "AUTH_LOGIN",
      targetEntity: user.id,
      details: `Inicio de sesión exitoso como ${user.role}`,
      severity: "INFO",
    });
    return { success: true, user };
  },

  logout: () => {
    if (state.currentUser) {
      logAuditEvent({
        actorId: state.currentUser.id,
        actorName: state.currentUser.name,
        actorRole: state.currentUser.role,
        action: "AUTH_LOGOUT",
        targetEntity: state.currentUser.id,
        details: "Cierre de sesión de usuario",
        severity: "INFO",
      });
    }
    state = { ...state, currentUser: null };
    notify();
  },

  createAdminUser: (payload: { name: string; email: string; passwordPlain: string; role?: UserRole }) => {
    const exists = state.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) return { success: false, error: "Ya existe un usuario con este correo electrónico." };

    const newUser: UserAccount = {
      id: `usr-admin-${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      role: payload.role || "DELEGATED_ADMIN",
      passwordHash: payload.passwordPlain,
      createdAt: new Date().toISOString(),
      createdBy: state.currentUser?.id || "usr-superadmin-01",
      active: true,
      notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 24 },
    };

    state = { ...state, users: [...state.users, newUser] };
    notify();

    logAuditEvent({
      actorId: state.currentUser?.id || "usr-superadmin-01",
      actorName: state.currentUser?.name || "Marco (Superadmin)",
      actorRole: state.currentUser?.role || "SUPERADMIN",
      action: "ADMIN_CREATED",
      targetEntity: newUser.id,
      details: `Nuevo administrador creado: ${newUser.name} (${newUser.role})`,
      severity: "INFO",
    });
    return { success: true, user: newUser };
  },

  deleteAdminUser: (adminId: string) => {
    const target = state.users.find((u) => u.id === adminId);
    if (!target) return { success: false, error: "Usuario no encontrado." };
    if (target.role === "SUPERADMIN") return { success: false, error: "No se puede eliminar la cuenta del Superadmin." };

    state = { ...state, users: state.users.filter((u) => u.id !== adminId) };
    notify();

    logAuditEvent({
      actorId: state.currentUser?.id || "usr-superadmin-01",
      actorName: state.currentUser?.name || "Marco (Superadmin)",
      actorRole: "SUPERADMIN",
      action: "ADMIN_DELETED",
      targetEntity: adminId,
      details: `Administrador eliminado: ${target.name} (${target.email})`,
      severity: "WARNING",
    });
    return { success: true };
  },

  registerCitizen: (payload: { name: string; email: string; citizenId: string; phone?: string; passwordPlain: string }) => {
    const exists = state.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase() || (u.citizenId && u.citizenId === payload.citizenId));
    if (exists) return { success: false, error: "Ya existe una cuenta con este correo o cédula." };

    const newCitizen: UserAccount = {
      id: `usr-cit-${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      citizenId: payload.citizenId.trim(),
      phone: payload.phone?.trim(),
      role: "CITIZEN",
      passwordHash: payload.passwordPlain,
      createdAt: new Date().toISOString(),
      active: true,
      notifications: { email: true, sms: false, whatsapp: true, reminderHoursBefore: 24 },
    };

    state = { ...state, users: [...state.users, newCitizen], currentUser: newCitizen };
    notify();
    return { success: true, user: newCitizen };
  },

  updateNotificationPrefs: (userId: string, prefs: Partial<NotificationPrefs>) => {
    state = {
      ...state,
      users: state.users.map((u) => (u.id === userId ? { ...u, notifications: { ...u.notifications, ...prefs } } : u)),
      currentUser: state.currentUser?.id === userId ? { ...state.currentUser, notifications: { ...state.currentUser.notifications, ...prefs } } : state.currentUser,
    };
    notify();
  },
};
