import { describe, it, expect } from "vitest";
import { Ticket, SpecialGuestEntry } from "../tickets/types";
import {
  buildAttendeeList,
  filterAndSortAttendees,
  computeAttendeeMetrics,
  getSeatOrientationInfo,
} from "./attendee-utils";
import { AttendeeFilterState } from "./attendee-types";

describe("attendee-utils (Padrón de Acreditación y Verificación)", () => {
  const mockTickets: Ticket[] = [
    {
      id: "tkt-01",
      eventId: "evt-gala",
      citizenName: "Dra. Sofía Valverde",
      citizenId: "1-1120-0456",
      citizenPhone: "8844-1234",
      seatId: "PB-A-08",
      seatLabel: "Platea A-08",
      zone: "PLATEA_BAJA",
      qrCodeValue: "QR-01",
      shortCode: "SV08",
      isVipGuest: true,
      checkedIn: true,
      checkedInAt: "2026-09-25T18:42:00Z",
      status: "CHECKED_IN",
      releasedAt: null,
      createdAt: "2026-09-23T10:00:00Z",
    },
    {
      id: "tkt-02",
      eventId: "evt-gala",
      citizenName: "Don Alberto Méndez Ramos",
      citizenId: "1-0532-0988",
      seatId: "PB-B-05",
      seatLabel: "Platea B-05",
      zone: "PLATEA_BAJA",
      qrCodeValue: "QR-02",
      shortCode: "AM05",
      isVipGuest: false,
      checkedIn: false,
      checkedInAt: null,
      status: "ACTIVE",
      releasedAt: null,
      createdAt: "2026-09-23T11:20:00Z",
    },
    {
      id: "tkt-03",
      eventId: "evt-gala",
      citizenName: "Beatriz Solano Castro",
      citizenId: "2-0456-0789",
      seatId: "PB-C-02",
      seatLabel: "Platea C-02",
      zone: "PLATEA_BAJA",
      qrCodeValue: "QR-03",
      shortCode: "BS02",
      isVipGuest: false,
      checkedIn: false,
      checkedInAt: null,
      status: "RELEASED_NO_SHOW",
      releasedAt: "2026-09-25T19:00:00Z",
      createdAt: "2026-09-23T12:00:00Z",
    },
  ];

  const mockSpecialGuests: SpecialGuestEntry[] = [
    {
      id: "sp-01",
      eventId: "evt-gala",
      name: "Despacho de Alcaldía Municipal",
      citizenId: "1-0842-0391",
      seatId: "PB-A-06",
      ticketsCount: 2,
      notes: "Fila A Protocolaria",
      redeemedCount: 0,
    },
  ];

  it("buildAttendeeList unifica tickets y delegaciones correctamente", () => {
    const attendees = buildAttendeeList(mockTickets, mockSpecialGuests);
    expect(attendees).toHaveLength(4);

    const valverde = attendees.find((a) => a.id === "tkt-01");
    expect(valverde?.status).toBe("CHECKED_IN");
    expect(valverde?.isVip).toBe(true);

    const mendez = attendees.find((a) => a.id === "tkt-02");
    expect(mendez?.status).toBe("PENDING");

    const solano = attendees.find((a) => a.id === "tkt-03");
    expect(solano?.status).toBe("RELEASED_NO_SHOW");

    const alcaldia = attendees.find((a) => a.id === "sp-01");
    expect(alcaldia?.type).toBe("SPECIAL_GUEST");
    expect(alcaldia?.status).toBe("PENDING");
    expect(alcaldia?.ticketsCount).toBe(2);
  });

  it("filtra por búsqueda de Nombre, Cédula y Butaca", () => {
    const attendees = buildAttendeeList(mockTickets, mockSpecialGuests);
    const baseFilter: AttendeeFilterState = {
      searchQuery: "",
      statusFilter: "ALL",
      zoneFilter: "ALL",
      categoryFilter: "ALL",
      sortBy: "NAME_ASC",
    };

    // Búsqueda por Nombre
    const resNombre = filterAndSortAttendees(attendees, { ...baseFilter, searchQuery: "Méndez" });
    expect(resNombre).toHaveLength(1);
    expect(resNombre[0].name).toContain("Alberto Méndez");

    // Búsqueda por Cédula (sin guiones o parcial)
    const resCedula = filterAndSortAttendees(attendees, { ...baseFilter, searchQuery: "11200456" });
    expect(resCedula).toHaveLength(1);
    expect(resCedula[0].name).toContain("Sofía Valverde");

    // Búsqueda por Butaca
    const resButaca = filterAndSortAttendees(attendees, { ...baseFilter, searchQuery: "B-05" });
    expect(resButaca).toHaveLength(1);
    expect(resButaca[0].name).toContain("Alberto Méndez");
  });

  it("aplica orden inteligente SMART_PENDING_FIRST: primero pendientes y luego ingresados", () => {
    const attendees = buildAttendeeList(mockTickets, mockSpecialGuests);
    const filter: AttendeeFilterState = {
      searchQuery: "",
      statusFilter: "ALL",
      zoneFilter: "ALL",
      categoryFilter: "ALL",
      sortBy: "SMART_PENDING_FIRST",
    };

    const sorted = filterAndSortAttendees(attendees, filter);
    expect(sorted[0].status).toBe("PENDING"); // Alberto Méndez o Despacho Alcaldía
    expect(sorted[1].status).toBe("PENDING");
    // Al final los ya ingresados y liberados
    const lastItem = sorted[sorted.length - 1];
    expect(lastItem.status === "CHECKED_IN" || lastItem.status === "RELEASED_NO_SHOW").toBe(true);
  });

  it("calcula las métricas de aforo en tiempo real con exactitud", () => {
    const attendees = buildAttendeeList(mockTickets, mockSpecialGuests);
    const metrics = computeAttendeeMetrics(attendees, 100);

    // Total expected: 3 tickets (1 each) + 1 special guest with 2 tickets = 5
    expect(metrics.totalExpected).toBe(5);
    // Checked in: Valverde (1 ticket) = 1
    expect(metrics.checkedInCount).toBe(1);
    // Pending: Alberto (1) + Solano (1 released) + Alcaldía (2) = 4
    expect(metrics.pendingCount).toBe(4);
    // Attendance percentage: 1/5 = 20%
    expect(metrics.attendancePercentage).toBe(20);
  });

  it("proporciona orientaciones de butaca útiles para el personal de puerta", () => {
    const infoA08 = getSeatOrientationInfo("Platea A-08", "PLATEA_BAJA");
    expect(infoA08.zoneName).toBe("Platea Baja");
    expect(infoA08.recommendedAisle).toContain("Fila A");

    const infoBalcon = getSeatOrientationInfo("Balcón K-03", "BALCON_ALTO");
    expect(infoBalcon.zoneName).toBe("Balcón Superior");
    expect(infoBalcon.doorDirection).toContain("Gradas");
  });
});
