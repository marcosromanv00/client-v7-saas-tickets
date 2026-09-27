import { TheaterEvent, EventMode, TicketStyle } from "./types";

export interface EventDef {
  id: string;
  title: string;
  tagline: string;
  date: string;
  time: string;
  durationMinutes: number;
  genre: string;
  isPrivate: boolean;
  description: string;
  posterUrl: string;
  extraDates?: string[];
  mode?: EventMode;
  ticketStyle?: TicketStyle;
  braceletColorId?: string;
  braceletColorName?: string;
  braceletColorHex?: string;
  totalCapacity?: number;
}

const SPANISH_DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export function buildEvent(def: EventDef): TheaterEvent {
  const allDates = [def.date, ...(def.extraDates || [])];
  const datesAvailable = allDates.map((d) => {
    const dt = new Date(d + "T12:00:00Z");
    return {
      date: d,
      dayName: SPANISH_DAYS[dt.getUTCDay()],
      dayNumber: String(dt.getUTCDate()).padStart(2, "0"),
    };
  });

  const totalCap = def.totalCapacity || 225;

  return {
    id: def.id,
    title: def.title,
    tagline: def.tagline,
    date: def.date,
    time: def.time,
    durationMinutes: def.durationMinutes,
    mode: def.mode || "SEATED_NUMBERED",
    ticketStyle: def.ticketStyle || "HIBRIDO",
    status: "ACTIVE",
    isPrivate: def.isPrivate,
    braceletColorId: def.braceletColorId || "azul-rey",
    braceletColorName: def.braceletColorName || "Azul Rey",
    braceletColorHex: def.braceletColorHex || "#004ea2",
    totalCapacity: totalCap,
    plantaBajaCapacity: Math.min(totalCap, 82),
    balconCapacity: Math.max(0, totalCap - 151),
    vipRowsPlantaBaja: ["A"],
    vipRowsBalcon: ["N"],
    registrationEnabled: true,
    description: def.description,
    location: "Sala Principal, Teatro Municipal de Alajuela",
    posterUrl: def.posterUrl,
    genre: def.genre,
    datesAvailable,
    timeSlots: [def.time],
  };
}
