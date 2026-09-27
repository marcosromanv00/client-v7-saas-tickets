import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  TmAttendanceCounterRow,
  TmEntryRecordRow,
  PushAttendanceEntryPayload,
} from "./supabase-attendance-types";

/**
 * Guarda un registro de ingreso y actualiza el contador de aforo en Supabase Postgres
 */
export async function pushAttendanceEntryToSupabase(
  payload: PushAttendanceEntryPayload
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const nowIso = new Date().toISOString();

    // 1. Actualizar contador consolidado de la función
    const { error: counterError } = await supabase
      .from("tm_attendance_counters")
      .upsert(
        {
          event_id: payload.eventId,
          delivered_count: payload.newTotal,
          last_entry_at: nowIso,
          updated_at: nowIso,
        },
        { onConflict: "event_id" }
      );

    if (counterError) {
      console.warn("[Supabase Attendance] Error upserting counter:", counterError.message);
    }

    // 2. Insertar registro cronológico individual en el log de entradas
    const { error: recordError } = await supabase
      .from("tm_entry_records")
      .insert({
        event_id: payload.eventId,
        delta: payload.delta,
        running_total: payload.newTotal,
        entry_type: payload.entryType || "BRACELET",
        notes: payload.notes || null,
        citizen_name: payload.citizenName || null,
        seat_label: payload.seatLabel || null,
        operator_name: payload.operatorName || "Personal Puerta",
        created_at: nowIso,
      });

    if (recordError) {
      console.warn("[Supabase Attendance] Error inserting entry record:", recordError.message);
    }

    return !counterError && !recordError;
  } catch (err: unknown) {
    console.warn("[Supabase Attendance] Network/DB exception:", err);
    return false;
  }
}

/**
 * Consulta el estado y los registros recientes de ingreso para una función
 */
export async function fetchAttendanceHistoryFromSupabase(eventId: string): Promise<{
  deliveredCount: number;
  history: TmEntryRecordRow[];
} | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const [counterRes, historyRes] = await Promise.all([
      supabase
        .from("tm_attendance_counters")
        .select("delivered_count, total_capacity, last_entry_at, updated_at")
        .eq("event_id", eventId)
        .maybeSingle(),
      supabase
        .from("tm_entry_records")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

    if (counterRes.error) {
      console.warn("[Supabase Attendance] Error reading counter:", counterRes.error.message);
      return null;
    }

    const deliveredCount = counterRes.data?.delivered_count ?? 0;
    const history = (historyRes.data as TmEntryRecordRow[]) || [];

    return { deliveredCount, history };
  } catch (err: unknown) {
    console.warn("[Supabase Attendance] Fetch exception:", err);
    return null;
  }
}

/**
 * Suscribe a eventos en tiempo real para sincronizar el aforo entre dispositivos al instante
 */
export function subscribeAttendanceRealtime(
  eventId: string,
  onRemoteChange: (payload: { deliveredCount?: number; entry?: TmEntryRecordRow }) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channelName = `tm_realtime_${eventId}`;
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tm_attendance_counters",
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        const newRecord = payload.new as TmAttendanceCounterRow | undefined;
        if (newRecord) {
          onRemoteChange({
            deliveredCount: typeof newRecord.delivered_count === "number" ? newRecord.delivered_count : undefined,
          });
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tm_entry_records",
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        const newEntry = payload.new as TmEntryRecordRow | undefined;
        if (newEntry) {
          onRemoteChange({
            deliveredCount: newEntry.running_total,
            entry: newEntry,
          });
        }
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Actualiza la capacidad de butacas de un evento en Supabase Postgres
 */
export async function pushEventCapacityToSupabase(
  eventId: string,
  totalCapacity: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase
      .from("tm_attendance_counters")
      .upsert(
        {
          event_id: eventId,
          total_capacity: totalCapacity,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "event_id" }
      );
    return !error;
  } catch {
    return false;
  }
}
