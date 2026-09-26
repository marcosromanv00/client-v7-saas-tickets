import { TheaterEvent, EventMode } from "./types";

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
  braceletColorId?: string;
  braceletColorName?: string;
  braceletColorHex?: string;
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

  return {
    id: def.id,
    title: def.title,
    tagline: def.tagline,
    date: def.date,
    time: def.time,
    durationMinutes: def.durationMinutes,
    mode: def.mode || "SEATED_NUMBERED",
    status: "ACTIVE",
    isPrivate: def.isPrivate,
    braceletColorId: def.braceletColorId || "azul-rey",
    braceletColorName: def.braceletColorName || "Azul Rey",
    braceletColorHex: def.braceletColorHex || "#004ea2",
    totalCapacity: 220,
    plantaBajaCapacity: 158,
    balconCapacity: 62,
    vipRowsPlantaBaja: ["A"],
    vipRowsBalcon: ["K"],
    registrationEnabled: true,
    description: def.description,
    location: "Sala Principal, Teatro Municipal de Alajuela",
    posterUrl: def.posterUrl,
    genre: def.genre,
    datesAvailable,
    timeSlots: [def.time],
  };
}
