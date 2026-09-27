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
            return {
              ...initEvt,
              ...saved,
              // Preservar siempre la definición oficial de modo y aforo del evento
              mode: initEvt.mode,
              totalCapacity: initEvt.totalCapacity,
              // Preservar personalizaciones de color de brazalete y switches
              braceletColorId: saved.braceletColorId || initEvt.braceletColorId,
              braceletColorName: saved.braceletColorName || initEvt.braceletColorName,
              braceletColorHex: saved.braceletColorHex || initEvt.braceletColorHex,
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
          parsed.tickets = parsed.tickets.filter((t: Ticket) => t.eventId !== "evt-pato-barraza-26");
        }
        if (!parsed.braceletColors || parsed.braceletColors.length === 0) {
          parsed.braceletColors = DEFAULT_BRACELET_COLORS;
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
