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

export function buildEventInstances(def: EventDef): TheaterEvent[] {
  const extraDates = def.extraDates || [];
  if (extraDates.length === 0) {
    return [buildEvent(def)];
  }

  const allDates = [def.date, ...extraDates];
  return allDates.map((dateStr, index) => {
    const dt = new Date(dateStr + "T12:00:00Z");
    const dayName = SPANISH_DAYS[dt.getUTCDay()];
    const dayNum = String(dt.getUTCDate()).padStart(2, "0");
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];
    const month = monthNames[dt.getUTCMonth()];
    const dateLabel = `${dayName} ${dayNum} ${month}`;

    const daySuffix = dateStr.slice(-2);
    const instanceId = index === 0 ? def.id : `${def.id.replace(/-\d{2}$/, "")}-${daySuffix}`;
    const instanceTitle = `${def.title} (${dateLabel})`;

    return buildEvent({
      ...def,
      id: instanceId,
      date: dateStr,
      title: instanceTitle,
      extraDates: undefined,
    });
  });
}

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
    mode: def.mode || "GENERAL_ADMISSION",
    ticketStyle: def.ticketStyle || "UNICO",
    status: "ACTIVE",
    isPrivate: def.isPrivate,
    braceletColorId: def.braceletColorId || "blanco",
    braceletColorName: def.braceletColorName || "Blanco Puro Oficial",
    braceletColorHex: def.braceletColorHex || "#ffffff",
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
