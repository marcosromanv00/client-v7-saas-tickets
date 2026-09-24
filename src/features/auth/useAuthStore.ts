import { useSyncExternalStore } from "react";
import { authStore } from "./auth-store";
import { NotificationPrefs } from "./types";

export function useAuthStore() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot
  );

  return {
    users: state.users,
    currentUser: state.currentUser,
    isAuthenticated: !!state.currentUser,
    isSuperAdmin: state.currentUser?.role === "SUPERADMIN",
    isProducer: state.currentUser?.role === "PRODUCER",
    isAdminStaff: state.currentUser?.role === "DELEGATED_ADMIN",
    isStaff: state.currentUser?.role === "DELEGATED_ADMIN",
    isCitizen: state.currentUser?.role === "CITIZEN",
    login: authStore.login,
    logout: authStore.logout,
    createAdminUser: authStore.createAdminUser,
    deleteAdminUser: authStore.deleteAdminUser,
    registerCitizen: authStore.registerCitizen,
    updateNotificationPrefs: authStore.updateNotificationPrefs,
    updateNotifications: (prefs: Partial<NotificationPrefs>) => {
      if (state.currentUser) {
        authStore.updateNotificationPrefs(state.currentUser.id, prefs);
      }
    },
  };
}

export const useAuth = useAuthStore;
