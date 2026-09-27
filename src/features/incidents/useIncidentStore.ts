import { useSyncExternalStore } from "react";
import { incidentStore } from "./incident-store";

export function useIncidentStore() {
  const state = useSyncExternalStore(
    incidentStore.subscribe,
    incidentStore.getSnapshot,
    incidentStore.getSnapshot
  );

  return {
    incidents: state.incidents,
    createIncident: incidentStore.createIncident,
    resolveIncident: incidentStore.resolveIncident,
    updateStatus: incidentStore.updateStatus,
    deleteIncident: incidentStore.deleteIncident,
    resetStore: incidentStore.resetStore,
  };
}
