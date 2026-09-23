import { TheaterEvent, Ticket, SpecialGuestEntry, Seat } from "./types";

export interface DynamicCapacityReport {
  totalCapacity: number;
  plantaBajaTotal: number;
  balconTotal: number;
  preReservedCount: number;
  checkedInCount: number;
  walkInCount: number;
  availableRemaining: number;
  vipReservedCount: number;
  percentageOccupied: number;
}

export function computeDynamicCapacity(
  event: TheaterEvent,
  tickets: Ticket[],
  specialGuests: SpecialGuestEntry[],
  seats: Seat[]
): DynamicCapacityReport {
  const eventTickets = tickets.filter((t) => t.eventId === event.id);
  const eventGuests = specialGuests.filter((g) => g.eventId === event.id);

  // Invitaciones especiales no redimidas aún reservan cupo
  const pendingSpecialTickets = eventGuests.reduce(
    (acc, g) => acc + Math.max(0, g.ticketsCount - g.redeemedCount),
    0
  );

  const preReservedCount = eventTickets.length + pendingSpecialTickets;
  const checkedInCount = eventTickets.filter((t) => t.checkedIn).length;
  const walkInCount = eventTickets.filter((t) => t.notes?.includes("Walk-in")).length;

  const total = event.totalCapacity;
  const availableRemaining = Math.max(0, total - preReservedCount);
  const percentageOccupied = total > 0 ? Math.min(100, Math.round((preReservedCount / total) * 100)) : 0;

  const vipReservedCount = seats.filter(
    (s) => s.isVip && (s.status === "RESERVED" || s.status === "OCCUPIED")
  ).length;

  return {
    totalCapacity: total,
    plantaBajaTotal: event.plantaBajaCapacity,
    balconTotal: event.balconCapacity,
    preReservedCount,
    checkedInCount,
    walkInCount,
    availableRemaining,
    vipReservedCount,
    percentageOccupied,
  };
}
