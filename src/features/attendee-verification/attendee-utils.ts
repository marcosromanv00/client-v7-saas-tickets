import { Ticket, SpecialGuestEntry, ZoneId } from "../tickets/types";
import {
  AttendeeItem,
  AttendeeFilterState,
  AttendeeMetrics,
  SeatOrientation,
} from "./attendee-types";

export function buildAttendeeList(
  tickets: Ticket[],
  specialGuests: SpecialGuestEntry[]
): AttendeeItem[] {
  const ticketItems: AttendeeItem[] = tickets.map((t) => {
    let status: "PENDING" | "CHECKED_IN" | "RELEASED_NO_SHOW" = "PENDING";
    if (t.status === "RELEASED_NO_SHOW") {
      status = "RELEASED_NO_SHOW";
    } else if (t.checkedIn) {
      status = "CHECKED_IN";
    }

    return {
      id: t.id,
      ticketId: t.id,
      specialGuestId: null,
      type: "TICKET",
      name: t.citizenName,
      citizenId: t.citizenId,
      citizenPhone: t.citizenPhone,
      seatLabel: t.seatLabel,
      seatId: t.seatId,
      zone: t.zone,
      shortCode: t.shortCode,
      status,
      checkedInAt: t.checkedInAt,
      isVip: Boolean(t.isVipGuest),
      notes: t.notes,
      ticketsCount: 1,
      redeemedCount: t.checkedIn ? 1 : 0,
    };
  });

  const guestItems: AttendeeItem[] = specialGuests.map((g) => {
    const isFullyRedeemed = g.redeemedCount >= g.ticketsCount;
    return {
      id: g.id,
      ticketId: null,
      specialGuestId: g.id,
      type: "SPECIAL_GUEST",
      name: g.name || "Invitación de Protocolo",
      citizenId: g.citizenId,
      seatLabel: g.seatId ? `Butaca ${g.seatId}` : "Espacio Reservado",
      seatId: g.seatId,
      zone: "PLATEA_BAJA",
      shortCode: undefined,
      status: isFullyRedeemed ? "CHECKED_IN" : "PENDING",
      checkedInAt: null,
      isVip: true,
      notes: g.notes,
      ticketsCount: g.ticketsCount,
      redeemedCount: g.redeemedCount,
    };
  });

  return [...ticketItems, ...guestItems];
}

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function filterAndSortAttendees(
  attendees: AttendeeItem[],
  filters: AttendeeFilterState
): AttendeeItem[] {
  const query = filters.searchQuery.trim();
  const normalizedQuery = normalizeSearchText(query);

  const filtered = attendees.filter((item) => {
    // 1. Filtro de búsqueda
    if (normalizedQuery) {
      const matchName = normalizeSearchText(item.name).includes(normalizedQuery);
      const matchCedula = item.citizenId ? normalizeSearchText(item.citizenId).includes(normalizedQuery) : false;
      const matchSeat = item.seatLabel ? normalizeSearchText(item.seatLabel).includes(normalizedQuery) : false;
      const matchCode = item.shortCode ? normalizeSearchText(item.shortCode).includes(normalizedQuery) : false;

      if (!matchName && !matchCedula && !matchSeat && !matchCode) {
        return false;
      }
    }

    // 2. Filtro de Estado
    if (filters.statusFilter !== "ALL" && item.status !== filters.statusFilter) {
      return false;
    }

    // 3. Filtro de Zona
    if (filters.zoneFilter !== "ALL" && item.zone !== filters.zoneFilter) {
      return false;
    }

    // 4. Filtro de Categoría
    if (filters.categoryFilter === "VIP_ONLY" && !item.isVip) return false;
    if (filters.categoryFilter === "REGULAR_ONLY" && item.isVip) return false;

    return true;
  });

  // Ordenamiento
  return [...filtered].sort((a, b) => {
    if (filters.sortBy === "SMART_PENDING_FIRST") {
      const rank = (status: string) => (status === "PENDING" ? 0 : 1);
      const rankDiff = rank(a.status) - rank(b.status);
      if (rankDiff !== 0) return rankDiff;
      return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
    }

    if (filters.sortBy === "NAME_ASC") {
      return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
    }

    if (filters.sortBy === "SEAT_ASC") {
      const seatA = a.seatLabel || "ZZ";
      const seatB = b.seatLabel || "ZZ";
      return seatA.localeCompare(seatB, "es", { numeric: true });
    }

    return 0;
  });
}

export function computeAttendeeMetrics(
  attendees: AttendeeItem[],
  _capacity: number
): AttendeeMetrics {
  let totalExpected = 0;
  let checkedInCount = 0;
  let vipCount = 0;

  for (const item of attendees) {
    totalExpected += item.ticketsCount;
    checkedInCount += item.redeemedCount;
    if (item.isVip) vipCount += item.ticketsCount;
  }

  const pendingCount = Math.max(0, totalExpected - checkedInCount);
  const attendancePercentage = totalExpected > 0
    ? Math.round((checkedInCount / totalExpected) * 1000) / 10
    : 0;

  return {
    totalExpected,
    checkedInCount,
    pendingCount,
    vipCount,
    attendancePercentage,
  };
}

export function getSeatOrientationInfo(
  seatLabel: string | null,
  zone: ZoneId | null
): SeatOrientation {
  const cleanZone = zone === "BALCON_ALTO" ? "Balcón Superior" : zone === "NIVEL_MEDIO" ? "Nivel Medio" : "Platea Baja";

  if (!seatLabel) {
    return {
      zoneName: cleanZone,
      doorDirection: "Acceso General Principal",
      recommendedAisle: "Consulte a acomodador de sala",
    };
  }

  const rowMatch = seatLabel.match(/([A-O])-?([0-9]{1,2})/i);
  const row = rowMatch ? rowMatch[1].toUpperCase() : "";
  const num = rowMatch ? parseInt(rowMatch[2], 10) : 0;

  let doorDirection = "Puerta Principal";
  if (zone === "BALCON_ALTO") {
    doorDirection = "Acceso Gradas Superiores (Nivel 3)";
  } else if (num > 0) {
    doorDirection = num % 2 === 0 ? "Puerta Derecha (Pares)" : "Puerta Izquierda (Impares)";
  }

  return {
    zoneName: cleanZone,
    doorDirection,
    recommendedAisle: row ? `Fila ${row} • Asiento ${num}` : seatLabel,
  };
}
