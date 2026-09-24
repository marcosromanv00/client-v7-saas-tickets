import { useSyncExternalStore } from "react";
import { auditLogStore, logAuditEvent } from "./audit-logger";

export function useAuditLogs() {
  const logs = useSyncExternalStore(
    auditLogStore.subscribe,
    auditLogStore.getSnapshot,
    auditLogStore.getSnapshot
  );

  return {
    logs,
    logEvent: logAuditEvent,
    clearLogs: auditLogStore.clearLogs,
  };
}
