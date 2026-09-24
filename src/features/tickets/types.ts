import { z } from "zod";

export const EventModeSchema = z.enum(["SEATED_NUMBERED", "GENERAL_ADMISSION"]);
export type EventMode = z.infer<typeof EventModeSchema>;

export const EventStatusSchema = z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const ZoneIdSchema = z.enum([
  "PLATEA_BAJA",  // Nivel 1: Platea Baja (filas A-D, frente al escenario)
  "NIVEL_MEDIO",  // Nivel 2: Nivel Medio (filas E-J, detrás de la pasarela y gradas)
  "BALCON_ALTO",  // Nivel 3: Balcón Superior (filas K-O)
  "PLANTA_BAJA",  // Alias de compatibilidad (Niveles 1 y 2 combinados)
  "BALCON",       // Alias de compatibilidad
]);
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

export const BraceletColorSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string(),
  description: z.string().optional(),
});
export type BraceletColor = z.infer<typeof BraceletColorSchema>;

export const TicketStatusSchema = z.enum([
  "ACTIVE",
  "CHECKED_IN",
  "RELEASED_NO_SHOW",
  "CANCELLED",
]);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const TicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  citizenName: z.string().min(2, "El nombre debe contener al menos 2 caracteres"),
  citizenId: z.string().min(6, "Cédula o documento debe tener al menos 6 caracteres"),
  citizenPhone: z.string().optional(),
  citizenEmail: z.string().optional(),
  seatId: z.string().nullable(),
  seatLabel: z.string().nullable(),
  zone: ZoneIdSchema,
  qrCodeValue: z.string(),
  shortCode: z.string().default(""), // 2 letras + 2 dígitos ej: "AL14"
  isVipGuest: z.boolean().default(false),
  checkedIn: z.boolean().default(false),
  checkedInAt: z.string().nullable().default(null),
  status: TicketStatusSchema.default("ACTIVE"),
  releasedAt: z.string().nullable().default(null),
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
  braceletColorId: z.string().default("azul-rey"),
  braceletColorName: z.string().default("Azul Rey"),
  braceletColorHex: z.string().default("#004ea2"),
  totalCapacity: z.number().int().default(220),
  plantaBajaCapacity: z.number().int().default(158),
  balconCapacity: z.number().int().default(62),
  vipRowsPlantaBaja: z.array(z.string()).default(["A"]),
  vipRowsBalcon: z.array(z.string()).default(["K"]),
  registrationEnabled: z.boolean().default(true),
  description: z.string(),
  location: z.string().default("Sala Principal, Teatro Municipal"),
  posterUrl: z.string().optional(),
  genre: z.string().default("Teatro / Artes Escénicas"),
  datesAvailable: z.array(z.object({
    date: z.string(),
    dayName: z.string(),
    dayNumber: z.string(),
  })).optional(),
  timeSlots: z.array(z.string()).default(["17:00", "19:00", "20:30"]),
  price: z.number().nonnegative().optional(),
});
export type TheaterEvent = z.infer<typeof TheaterEventSchema>;

export interface SeatStats {
  total: number;
  available: number;
  reserved: number;
  occupied: number;
  vip: number;
}
