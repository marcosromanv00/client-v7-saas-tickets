import { useSyncExternalStore } from "react";
import { staffTimeStore } from "./staff-time-store";

export function useStaffTimeStore() {
  const state = useSyncExternalStore(
    staffTimeStore.subscribe,
    staffTimeStore.getSnapshot,
    staffTimeStore.getSnapshot
  );

  return {
    entries: state.entries,
    getActiveShift: staffTimeStore.getActiveShift,
    clockIn: staffTimeStore.clockIn,
    clockOut: staffTimeStore.clockOut,
    recordDirectEntry: staffTimeStore.recordDirectEntry,
    clockOutById: staffTimeStore.clockOutById,
    resetStore: staffTimeStore.resetStore,
  };
}
