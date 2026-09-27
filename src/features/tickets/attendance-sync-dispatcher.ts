import {
  pushAttendanceEntryToSupabase,
  subscribeAttendanceRealtime,
  fetchAttendanceHistoryFromSupabase,
  pushEventCapacityToSupabase,
} from "./supabase-attendance-service";
import { PushAttendanceEntryPayload } from "./supabase-attendance-types";

/**
 * Despacha de forma no-bloqueante el registro de entrada a Supabase DB
 */
export function dispatchAttendancePush(payload: PushAttendanceEntryPayload): void {
  pushAttendanceEntryToSupabase(payload).catch((err) => {
    console.warn("[Attendance Dispatcher] Error pushing to DB:", err);
  });
}

/**
 * Sincroniza la capacidad configurada de butacas en Supabase DB
 */
export function dispatchEventCapacityPush(eventId: string, totalCapacity: number): void {
  pushEventCapacityToSupabase(eventId, totalCapacity).catch((err) => {
    console.warn("[Attendance Dispatcher] Error pushing capacity to DB:", err);
  });
}

/**
 * Inicializa la escucha en tiempo real de Supabase para las funciones activas
 */
export function setupRealtimeAttendanceListener(
  eventIds: string[],
  onRemoteUpdate: (eventId: string, deliveredCount: number) => void
): () => void {
  const cleanups: (() => void)[] = [];

  eventIds.forEach((eventId) => {
    // 1. Hidratación inicial desde Supabase si existe
    fetchAttendanceHistoryFromSupabase(eventId)
      .then((data) => {
        if (data && typeof data.deliveredCount === "number") {
          onRemoteUpdate(eventId, data.deliveredCount);
        }
      })
      .catch(() => {});

    // 2. Suscripción por WebSocket a cambios en vivo
    const unsub = subscribeAttendanceRealtime(eventId, ({ deliveredCount }) => {
      if (typeof deliveredCount === "number") {
        onRemoteUpdate(eventId, deliveredCount);
      }
    });

    cleanups.push(unsub);
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}
