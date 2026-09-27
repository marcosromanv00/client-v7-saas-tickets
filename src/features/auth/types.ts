import { z } from "zod";

import { StaffApprovalStatusSchema, StaffDutySchema } from "../staff/types";
export type { StaffApprovalStatus, StaffDuty } from "../staff/types";

export const RoleSchema = z.enum(["SUPERADMIN", "PRODUCER", "DELEGATED_ADMIN", "CITIZEN"]);
export type UserRole = z.infer<typeof RoleSchema>;

export const NotificationPrefsSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  whatsapp: z.boolean(),
  reminderHoursBefore: z.number().default(24),
});
export type NotificationPrefs = z.infer<typeof NotificationPrefsSchema>;

export const UserAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: RoleSchema,
  phone: z.string().optional(),
  citizenId: z.string().optional(),
  passwordHash: z.string(),
  createdAt: z.string(),
  createdBy: z.string().optional(),
  active: z.boolean().default(true),
  approvalStatus: StaffApprovalStatusSchema.default("APPROVED"),
  assignedDuty: StaffDutySchema.default("GENERAL"),
  notifications: NotificationPrefsSchema.default({
    email: true,
    sms: false,
    whatsapp: true,
    reminderHoursBefore: 24,
  }),
});
export type UserAccount = z.infer<typeof UserAccountSchema>;

export const AuditActionSchema = z.enum([
  "AUTH_LOGIN",
  "AUTH_LOGOUT",
  "ADMIN_CREATED",
  "ADMIN_DELETED",
  "ADMIN_STATUS_CHANGED",
  "STAFF_REGISTERED",
  "STAFF_APPROVED",
  "STAFF_REJECTED",
  "STAFF_DUTY_CHANGED",
  "STAFF_CLOCK_IN",
  "STAFF_CLOCK_OUT",
  "INCIDENT_REPORTED",
  "INCIDENT_RESOLVED",
  "TICKET_BOOKED",
  "TICKET_CHECKIN",
  "VIP_INVITE_ISSUED",
  "EVENT_CONFIG_UPDATED",
  "CAPACITY_OVERRIDDEN",
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditSeveritySchema = z.enum(["INFO", "WARNING", "CRITICAL"]);
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

export const AuditLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  actorRole: RoleSchema,
  action: AuditActionSchema,
  targetEntity: z.string(),
  details: z.string(),
  severity: AuditSeveritySchema.default("INFO"),
});
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
