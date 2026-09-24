import { z } from "zod";
import { ZoneIdSchema, type ZoneId } from "../tickets/types";

export type { ZoneId };

export const AttendeeTypeSchema = z.enum(["TICKET", "SPECIAL_GUEST"]);
export type AttendeeType = z.infer<typeof AttendeeTypeSchema>;

export const AttendeeCheckInStatusSchema = z.enum(["PENDING", "CHECKED_IN", "RELEASED_NO_SHOW"]);
export type AttendeeCheckInStatus = z.infer<typeof AttendeeCheckInStatusSchema>;

export const AttendeeItemSchema = z.object({
  id: z.string(),
  ticketId: z.string().nullable().optional(),
  specialGuestId: z.string().nullable().optional(),
  type: AttendeeTypeSchema,
  name: z.string(),
  citizenId: z.string().nullable(),
  citizenPhone: z.string().optional(),
  seatLabel: z.string().nullable(),
  seatId: z.string().nullable(),
  zone: ZoneIdSchema.nullable(),
  shortCode: z.string().optional(),
  status: AttendeeCheckInStatusSchema,
  checkedInAt: z.string().nullable(),
  isVip: z.boolean(),
  notes: z.string().optional(),
  ticketsCount: z.number().int().min(1).default(1),
  redeemedCount: z.number().int().min(0).default(0),
});
export type AttendeeItem = z.infer<typeof AttendeeItemSchema>;

export const AttendeeSortModeSchema = z.enum(["SMART_PENDING_FIRST", "NAME_ASC", "SEAT_ASC"]);
export type AttendeeSortMode = z.infer<typeof AttendeeSortModeSchema>;

export const AttendeeStatusFilterSchema = z.enum(["ALL", "PENDING", "CHECKED_IN", "RELEASED_NO_SHOW"]);
export type AttendeeStatusFilter = z.infer<typeof AttendeeStatusFilterSchema>;

export const AttendeeCategoryFilterSchema = z.enum(["ALL", "VIP_ONLY", "REGULAR_ONLY"]);
export type AttendeeCategoryFilter = z.infer<typeof AttendeeCategoryFilterSchema>;

export const AttendeeFilterStateSchema = z.object({
  searchQuery: z.string(),
  statusFilter: AttendeeStatusFilterSchema,
  zoneFilter: z.union([ZoneIdSchema, z.literal("ALL")]),
  categoryFilter: AttendeeCategoryFilterSchema,
  sortBy: AttendeeSortModeSchema,
});
export type AttendeeFilterState = z.infer<typeof AttendeeFilterStateSchema>;

export const AttendeeMetricsSchema = z.object({
  totalExpected: z.number().int().nonnegative(),
  checkedInCount: z.number().int().nonnegative(),
  pendingCount: z.number().int().nonnegative(),
  vipCount: z.number().int().nonnegative(),
  attendancePercentage: z.number().min(0).max(100),
});
export type AttendeeMetrics = z.infer<typeof AttendeeMetricsSchema>;

export interface SeatOrientation {
  zoneName: string;
  doorDirection: string;
  recommendedAisle: string;
}
