export type TmEntryType = "BRACELET" | "QR_SCAN" | "MANUAL_CODE" | "LIST_CHECKIN";

export interface TmAttendanceCounterRow {
  event_id: string;
  delivered_count: number;
  total_capacity: number;
  last_entry_at: string;
  updated_at: string;
}

export interface TmEntryRecordRow {
  id: string;
  event_id: string;
  delta: number;
  running_total: number;
  entry_type: TmEntryType;
  notes: string | null;
  citizen_name: string | null;
  seat_label: string | null;
  operator_name: string | null;
  created_at: string;
}

export interface PushAttendanceEntryPayload {
  eventId: string;
  delta: number;
  newTotal: number;
  entryType?: TmEntryType;
  notes?: string;
  citizenName?: string;
  seatLabel?: string;
  operatorName?: string;
}
