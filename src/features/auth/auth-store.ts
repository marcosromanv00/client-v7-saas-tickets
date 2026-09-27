import { UserAccount, UserRole, NotificationPrefs } from "./types";
import { logAuditEvent } from "./audit-logger";
import {
  USERS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  loadStoredUsers,
  loadStoredSession,
} from "./auth-defaults";
import {
  createAdminUserPure,
  deleteAdminUserPure,
  registerCitizenPure,
} from "./auth-admin-actions";
import {
  registerStaffPure,
  approveStaffPure,
  rejectStaffPure,
  assignDutyPure,
  RegisterStaffPayload,
} from "../staff/staff-account-service";
import { StaffDuty } from "../staff/types";

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

  login: (identifier: string, passwordPlain: string): { success: boolean; user?: UserAccount; error?: string } => {
    const clean = identifier.toLowerCase().trim();
    const user = state.users.find(
      (u) => u.email.toLowerCase().trim() === clean || (u.citizenId && u.citizenId.trim() === clean)
    );
    if (!user || user.passwordHash !== passwordPlain) {
      logAuditEvent({
        actorId: "anonymous",
        actorName: identifier || "Desconocido",
        actorRole: "CITIZEN",
        action: "AUTH_LOGIN",
        targetEntity: identifier,
        details: "Intento fallido de inicio de sesión",
        severity: "WARNING",
      });
      return { success: false, error: "Credenciales inválidas. Compruebe correo/cédula y contraseña." };
    }
    if (user.approvalStatus === "PENDING_APPROVAL") {
      return {
        success: false,
        error: "Tu cuenta de personal está pendiente de aprobación por el Superadministrador (Marco). En breve será validada.",
      };
    }
    if (user.approvalStatus === "REJECTED") {
      return { success: false, error: "Esta solicitud de personal no fue aprobada por la administración." };
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
      details: `Inicio de sesión exitoso como ${user.role} (${user.assignedDuty || "GENERAL"})`,
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
    const res = createAdminUserPure(state.users, payload, state.currentUser?.id);
    if (res.success && res.user) {
      state = { ...state, users: res.users };
      notify();
    }
    return res;
  },

  deleteAdminUser: (adminId: string) => {
    const res = deleteAdminUserPure(state.users, adminId, state.currentUser?.id);
    if (res.success) {
      state = { ...state, users: res.users };
      notify();
    }
    return res;
  },

  registerCitizen: (payload: { name: string; email: string; citizenId: string; phone?: string; passwordPlain: string }) => {
    const res = registerCitizenPure(state.users, payload);
    if (res.success && res.user) {
      state = { ...state, users: res.users, currentUser: res.user };
      notify();
    }
    return res;
  },

  registerStaff: (payload: RegisterStaffPayload) => {
    const res = registerStaffPure(state.users, payload);
    if (res.success) {
      state = { ...state, users: res.users };
      notify();
    }
    return res;
  },

  approveStaff: (staffId: string, duty?: StaffDuty) => {
    const res = approveStaffPure(state.users, staffId, duty, state.currentUser?.id, state.currentUser?.name);
    if (res.success) {
      state = { ...state, users: res.users };
      notify();
    }
    return res;
  },

  rejectStaff: (staffId: string) => {
    const res = rejectStaffPure(state.users, staffId, state.currentUser?.id, state.currentUser?.name);
    if (res.success) {
      state = { ...state, users: res.users };
      notify();
    }
    return res;
  },

  assignDuty: (staffId: string, duty: StaffDuty) => {
    const res = assignDutyPure(state.users, staffId, duty, state.currentUser?.id, state.currentUser?.name);
    if (res.success) {
      const isSelf = state.currentUser?.id === staffId;
      state = {
        ...state,
        users: res.users,
        currentUser: isSelf && state.currentUser ? { ...state.currentUser, assignedDuty: duty } : state.currentUser,
      };
      notify();
    }
    return res;
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
