import { TheaterEvent, Ticket, SpecialGuestEntry, Seat, BraceletColor } from "./types";
import { EventBraceletCounter } from "../bracelet-counter/bracelet-counter-types";

export interface TheaterState {
  events: TheaterEvent[];
  tickets: Ticket[];
  specialGuests: SpecialGuestEntry[];
  seatsByEvent: Record<string, Seat[]>;
  braceletColors: BraceletColor[];
  braceletCountersByEvent: Record<string, EventBraceletCounter>;
}
