import { TheaterEvent, Ticket, SpecialGuestEntry } from "./types";
import { OFFICIAL_AGENDA_EVENTS } from "./official-agenda";

// Base de datos de eventos oficiales del Teatro Municipal (fuente oficial AGENDA TEATRO MUNICIPAL.xlsx)
export const INITIAL_EVENTS: TheaterEvent[] = OFFICIAL_AGENDA_EVENTS;

// Invitaciones de protocolo y espacios reservados para la Gran Reapertura Privada (Viernes 25)
export const INITIAL_SPECIAL_GUESTS: SpecialGuestEntry[] = [
  {
    id: "sp-01",
    eventId: "evt-reapertura-25",
    name: "Despacho de Alcaldía Municipal",
    citizenId: "1-0842-0391",
    seatId: "PB-A-06",
    ticketsCount: 2,
    notes: "Invitación de Honor - Fila A Protocolaria",
    redeemedCount: 0,
  },
  {
    id: "sp-02",
    eventId: "evt-reapertura-25",
    name: "Concejo Municipal y Regiduría",
    citizenId: null,
    seatId: null,
    ticketsCount: 8,
    notes: "Reserva de bloque institucional para cuerpo de regidores",
    redeemedCount: 2,
  },
  {
    id: "sp-03",
    eventId: "evt-reapertura-25",
    name: "Dra. Sofía Valverde (Dirección de Patrimonio)",
    citizenId: "1-1120-0456",
    seatId: "PB-A-08",
    ticketsCount: 1,
    notes: "Conferencista e investigadora de patrimonio arquitectónico",
    redeemedCount: 1,
  },
  {
    id: "sp-04",
    eventId: "evt-reapertura-25",
    name: "Delegación Ministerio de Cultura",
    citizenId: null,
    seatId: null,
    ticketsCount: 6,
    notes: "Cupos de cortesía oficial para autoridades ministeriales",
    redeemedCount: 0,
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "tkt-001",
    eventId: "evt-reapertura-25",
    citizenName: "Dra. Sofía Valverde",
    citizenId: "1-1120-0456",
    citizenPhone: "8844-1234",
    seatId: "PB-A-08",
    seatLabel: "Platea A-08",
    zone: "PLATEA_BAJA",
    qrCodeValue: "TM-TKT-001-REAPERTURA-PB-A-08",
    isVipGuest: true,
    checkedIn: true,
    checkedInAt: "2026-09-25T18:42:00Z",
    createdAt: "2026-09-23T10:00:00Z",
  },
  {
    id: "tkt-002",
    eventId: "evt-reapertura-25",
    citizenName: "Don Alberto Méndez Ramos",
    citizenId: "1-0532-0988",
    citizenPhone: "8312-9900",
    seatId: "PB-B-05",
    seatLabel: "Platea B-05",
    zone: "PLATEA_BAJA",
    qrCodeValue: "TM-TKT-002-REAPERTURA-PB-B-05",
    isVipGuest: false,
    checkedIn: false,
    checkedInAt: null,
    createdAt: "2026-09-23T11:20:00Z",
  },
  {
    id: "tkt-003",
    eventId: "evt-pato-barraza-26",
    citizenName: "Mariana Rojas Castro",
    citizenId: "2-0741-0852",
    citizenPhone: "8999-3322",
    seatId: "PB-C-06",
    seatLabel: "Platea C-06",
    zone: "PLATEA_BAJA",
    qrCodeValue: "TM-TKT-003-PATO-PB-C-06",
    isVipGuest: false,
    checkedIn: false,
    checkedInAt: null,
    createdAt: "2026-09-23T12:00:00Z",
  },
];
