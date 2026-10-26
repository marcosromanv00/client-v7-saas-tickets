import { Seat } from "../tickets/types";
import { TheaterState } from "../tickets/ticket-store-types";
import { generateInitialSeats } from "../tickets/theater-layout";

export interface AcomodadorRoomMetrics {
  totalCapacity: number;
  braceletsDelivered: number;
  seatedInRoom: number;
  inTransitOrNoShow: number;
  availableSeats: number;
}

export function executeToggleSeatOccupancy(
  state: TheaterState,
  eventId: string,
  seatId: string
): TheaterState {
  const currentSeats = state.seatsByEvent[eventId] || generateInitialSeats();
  const targetSeat = currentSeats.find((s) => s.id === seatId);
  if (!targetSeat) return state;

  const nextStatus: "AVAILABLE" | "OCCUPIED" =
    targetSeat.status === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";
  const updatedSeats = currentSeats.map((s) =>
    s.id === seatId ? { ...s, status: nextStatus } : s
  );

  return {
    ...state,
    seatsByEvent: {
      ...state.seatsByEvent,
      [eventId]: updatedSeats,
    },
  };
}

export function executeFillRowOccupancy(
  state: TheaterState,
  eventId: string,
  rowLetter: string,
  fill: boolean
): TheaterState {
  const currentSeats = state.seatsByEvent[eventId] || generateInitialSeats();
  const updatedSeats = currentSeats.map((s) => {
    if (s.row !== rowLetter) return s;
    if (fill && s.status === "AVAILABLE") {
      return { ...s, status: "OCCUPIED" as const };
    }
    if (!fill && s.status === "OCCUPIED") {
      return { ...s, status: "AVAILABLE" as const };
    }
    return s;
  });

  return {
    ...state,
    seatsByEvent: {
      ...state.seatsByEvent,
      [eventId]: updatedSeats,
    },
  };
}

export function calculateAcomodadorRoomMetrics(
  totalCapacity: number,
  seats: Seat[],
  deliveredBracelets: number
): AcomodadorRoomMetrics {
  const seatedInRoom = seats.filter((s) => s.status === "OCCUPIED").length;
  const inTransitOrNoShow = Math.max(0, deliveredBracelets - seatedInRoom);
  const availableSeats = Math.max(0, totalCapacity - seatedInRoom);

  return {
    totalCapacity,
    braceletsDelivered: deliveredBracelets,
    seatedInRoom,
    inTransitOrNoShow,
    availableSeats,
  };
}
