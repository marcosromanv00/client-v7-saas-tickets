import { z } from "zod";

export const BraceletLogItemSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  delta: z.number().int(),
  totalAfter: z.number().int().nonnegative(),
  timestamp: z.string(),
  notes: z.string().optional(),
});
export type BraceletLogItem = z.infer<typeof BraceletLogItemSchema>;

export const EventBraceletCounterSchema = z.object({
  eventId: z.string(),
  deliveredCount: z.number().int().nonnegative().default(0),
  history: z.array(BraceletLogItemSchema).default([]),
});
export type EventBraceletCounter = z.infer<typeof EventBraceletCounterSchema>;

export type CapacityAlertLevel = "AVAILABLE" | "WARNING" | "FULL";

export interface BraceletMetrics {
  totalCapacity: number;
  deliveredCount: number;
  availableRemaining: number;
  percentageOccupied: number;
  status: CapacityAlertLevel;
  statusLabel: string;
}
