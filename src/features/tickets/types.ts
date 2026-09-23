import { z } from "zod";

export const EventModeSchema = z.enum(["SEATED_NUMBERED", "GENERAL_ADMISSION"]);
export type EventMode = z.infer<typeof EventModeSchema>;

export const EventStatusSchema = z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const ZoneIdSchema = z.enum(["PLANTA_BAJA", "BALCON"]);
export type ZoneId = z.infer<typeof ZoneIdSchema>;

export const SeatStatusSchema = z.enum(["AVAILABLE", "RESERVED", "OCCUPIED", "BLOCKED"]);
export type SeatStatus = z.infer<typeof SeatStatusSchema>;

export const SeatSchema = z.object({
  id: z.string(), // ej. "PB-A-01"
  zone: ZoneIdSchema,
  row: z.string(), // "A", "B", ...
  number: z.number().int().positive(),
  label: z.string(), // ej. "Platea A-01"
  isVip: z.boolean().default(false),
  status: SeatStatusSchema.default("AVAILABLE"),
});
export type Seat = z.infer<typeof SeatSchema>;

export const TicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  citizenName: z.string().min(2, "El nombre debe contener al menos 2 caracteres"),
  citizenId: z.string().min(6, "Cédula o documento debe tener al menos 6 caracteres"),
  citizenPhone: z.string().optional(),
  seatId: z.string().nullable(),
  seatLabel: z.string().nullable(),
  zone: ZoneIdSchema,
  qrCodeValue: z.string(),
  isVipGuest: z.boolean().default(false),
  checkedIn: z.boolean().default(false),
  checkedInAt: z.string().nullable().default(null),
  createdAt: z.string(),
  notes: z.string().optional(),
});
export type Ticket = z.infer<typeof TicketSchema>;

export const SpecialGuestEntrySchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string().nullable(),
  citizenId: z.string().nullable(),
  seatId: z.string().nullable(),
  ticketsCount: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  redeemedCount: z.number().int().min(0).default(0),
});
export type SpecialGuestEntry = z.infer<typeof SpecialGuestEntrySchema>;

export const TheaterEventSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  tagline: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:MM
  durationMinutes: z.number().int().positive(),
  mode: EventModeSchema,
  status: EventStatusSchema,
  isPrivate: z.boolean().default(false),
  totalCapacity: z.number().int().default(190),
  plantaBajaCapacity: z.number().int().default(120),
  balconCapacity: z.number().int().default(70),
  vipRowsPlantaBaja: z.array(z.string()).default(["A"]),
  vipRowsBalcon: z.array(z.string()).default(["K"]),
  registrationEnabled: z.boolean().default(true),
  description: z.string(),
  location: z.string().default("Sala Principal, Teatro Municipal"),
});
export type TheaterEvent = z.infer<typeof TheaterEventSchema>;

export interface SeatStats {
  total: number;
  available: number;
  reserved: number;
  occupied: number;
  vip: number;
}
