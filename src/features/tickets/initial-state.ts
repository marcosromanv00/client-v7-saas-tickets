import { TheaterState } from "./ticket-store-types";
import { INITIAL_EVENTS, INITIAL_SPECIAL_GUESTS, INITIAL_TICKETS } from "./mock-data";
import { generateInitialSeats } from "./theater-layout";
import { Seat } from "./types";

export const STORAGE_KEY = "tm_theater_state_v1";

export function loadInitialState(): TheaterState {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
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

  return {
    events: INITIAL_EVENTS,
    tickets: INITIAL_TICKETS,
    specialGuests: INITIAL_SPECIAL_GUESTS,
    seatsByEvent,
  };
}
