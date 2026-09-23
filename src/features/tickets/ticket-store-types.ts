import { TheaterEvent, Ticket, SpecialGuestEntry, Seat } from "./types";

export interface TheaterState {
  events: TheaterEvent[];
  tickets: Ticket[];
  specialGuests: SpecialGuestEntry[];
  seatsByEvent: Record<string, Seat[]>;
}
