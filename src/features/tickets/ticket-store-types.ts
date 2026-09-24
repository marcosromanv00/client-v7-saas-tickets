import { TheaterEvent, Ticket, SpecialGuestEntry, Seat, BraceletColor } from "./types";

export interface TheaterState {
  events: TheaterEvent[];
  tickets: Ticket[];
  specialGuests: SpecialGuestEntry[];
  seatsByEvent: Record<string, Seat[]>;
  braceletColors: BraceletColor[];
}
