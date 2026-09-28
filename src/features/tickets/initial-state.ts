import { TheaterState } from "./ticket-store-types";
import { INITIAL_EVENTS, INITIAL_SPECIAL_GUESTS, INITIAL_TICKETS } from "./mock-data";
import { generateInitialSeats } from "./theater-layout";
import { DEFAULT_BRACELET_COLORS } from "./bracelet-utils";
import { Seat, TheaterEvent, Ticket } from "./types";

export const STORAGE_KEY = "tm_theater_state_v4_agenda";
export const LEGACY_STORAGE_KEY = "tm_theater_state_v3_agenda";

export function loadInitialState(): TheaterState {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.events) && parsed.events.length > 0) {
          parsed.events = INITIAL_EVENTS.map((initEvt) => {
            const saved = parsed.events.find((e: TheaterEvent) => e.id === initEvt.id);
            if (!saved) return initEvt;

            // Para Escats hoy 27 de Septiembre, asegurar parámetros oficiales solicitados
            const isEscats = initEvt.id === "evt-escats-27";

            return {
              ...initEvt,
              ...saved,
              mode: saved.mode || initEvt.mode,
              ticketStyle: saved.ticketStyle || initEvt.ticketStyle || "HIBRIDO",
              totalCapacity: isEscats ? 185 : (saved.totalCapacity || initEvt.totalCapacity),
              braceletColorId: isEscats ? "blanco" : (saved.braceletColorId || initEvt.braceletColorId),
              braceletColorName: isEscats ? "Blanco Puro Oficial" : (saved.braceletColorName || initEvt.braceletColorName),
              braceletColorHex: isEscats ? "#ffffff" : (saved.braceletColorHex || initEvt.braceletColorHex),
              registrationEnabled:
                saved.registrationEnabled !== undefined
                  ? saved.registrationEnabled
                  : initEvt.registrationEnabled,
            };
          });
        } else {
          parsed.events = INITIAL_EVENTS;
        }

        // Función de sábado 26 es 100% brazalete sin listas ni padrón previo
        if (Array.isArray(parsed.tickets)) {
          parsed.tickets = parsed.tickets
            .filter((t: Ticket) => t.eventId !== "evt-pato-barraza-26")
            .map((t: Ticket) =>
              t.id === "tkt-003" && t.eventId === "evt-escats-27"
                ? { ...t, eventId: "evt-reapertura-25", qrCodeValue: "TM-TKT-003-REAPERTURA-PB-C-06" }
                : t
            );
        }

        if (!Array.isArray(parsed.specialGuests)) {
          parsed.specialGuests = INITIAL_SPECIAL_GUESTS;
        } else {
          // Asegurar sincronización de listas oficiales de invitados (ej: Escats 28 cupos)
          for (const initGuest of INITIAL_SPECIAL_GUESTS) {
            if (!parsed.specialGuests.some((g: { id: string }) => g.id === initGuest.id)) {
              parsed.specialGuests.push(initGuest);
            }
          }
        }
        if (!parsed.braceletColors || parsed.braceletColors.length === 0) {
          parsed.braceletColors = DEFAULT_BRACELET_COLORS;
        } else {
          // Asegurar que colores predeterminados nuevos (ej: blanco) estén en el catálogo
          for (const defCol of DEFAULT_BRACELET_COLORS) {
            if (!parsed.braceletColors.some((c: { id: string }) => c.id === defCol.id)) {
              parsed.braceletColors.push(defCol);
            }
          }
        }
        if (!parsed.seatsByEvent) parsed.seatsByEvent = {};
        if (!parsed.braceletCountersByEvent) parsed.braceletCountersByEvent = {};
        for (const evt of INITIAL_EVENTS) {
          if (!parsed.seatsByEvent[evt.id]) {
            parsed.seatsByEvent[evt.id] = generateInitialSeats(evt.vipRowsPlantaBaja, evt.vipRowsBalcon);
          }
          if (!parsed.braceletCountersByEvent[evt.id]) {
            parsed.braceletCountersByEvent[evt.id] = { eventId: evt.id, deliveredCount: 0, history: [] };
          }
        }
        return parsed;
      }
    } catch (err) {
      console.warn("Could not read from localStorage, fallback to initial data", err);
    }
  }

  const seatsByEvent: Record<string, Seat[]> = {};
  for (const evt of INITIAL_EVENTS) {
    const seats = generateInitialSeats(evt.vipRowsPlantaBaja, evt.vipRowsBalcon);
    for (const tkt of INITIAL_TICKETS) {
      if (tkt.eventId === evt.id && tkt.seatId) {
        const found = seats.find((s) => s.id === tkt.seatId);
        if (found) {
          found.status = tkt.checkedIn ? "OCCUPIED" : "RESERVED";
        }
      }
    }
    seatsByEvent[evt.id] = seats;
  }

  const braceletCountersByEvent: Record<string, { eventId: string; deliveredCount: number; history: [] }> = {};
  for (const evt of INITIAL_EVENTS) {
    braceletCountersByEvent[evt.id] = { eventId: evt.id, deliveredCount: 0, history: [] };
  }

  return {
    events: INITIAL_EVENTS,
    tickets: INITIAL_TICKETS,
    specialGuests: INITIAL_SPECIAL_GUESTS,
    seatsByEvent,
    braceletColors: DEFAULT_BRACELET_COLORS,
    braceletCountersByEvent,
  };
}
