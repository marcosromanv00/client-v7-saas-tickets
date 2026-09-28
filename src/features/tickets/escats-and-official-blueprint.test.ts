import { describe, it, expect, beforeEach } from "vitest";
import { theaterStore } from "./ticket-store";
import { DEFAULT_BRACELET_COLORS } from "./bracelet-utils";
import { generateInitialSeats } from "./theater-layout";
import { splitRowByBlueprint } from "../seat-reservation/theater-seat-map.utils";
import { computeDynamicCapacity } from "./capacity-calculator";
import { TheaterEvent } from "./types";

describe("Escats Concierto, Brazaletes Blancos, Estilos de Entrada y Plano 225", () => {
  beforeEach(() => {
    theaterStore.resetStore();
  });

  it("garantiza que el catálogo incluya el brazalete Blanco Puro Oficial", () => {
    const white = DEFAULT_BRACELET_COLORS.find((c) => c.id === "blanco");
    expect(white).toBeDefined();
    expect(white?.hex.toLowerCase()).toBe("#ffffff");
    expect(white?.name).toContain("Blanco");
  });

  it("configura la función de Escats de hoy 27 de Septiembre con 157 cupos para público y 28 brazaletes de invitados", () => {
    const snap = theaterStore.getSnapshot();
    const escats = snap.events.find((e) => e.id === "evt-escats-27");
    expect(escats).toBeDefined();
    expect(escats?.date).toBe("2026-09-27");
    expect(escats?.braceletColorId).toBe("blanco");
    expect(escats?.braceletColorHex.toLowerCase()).toBe("#ffffff");
    expect(escats?.totalCapacity).toBe(185);
    expect(escats?.ticketStyle).toBe("HIBRIDO");

    // Verificar las reservas de invitados de honor y banda Escats (28 cupos en total)
    const escatsGuests = snap.specialGuests.filter((g) => g.eventId === "evt-escats-27");
    const totalGuestBracelets = escatsGuests.reduce((acc, g) => acc + g.ticketsCount, 0);
    expect(totalGuestBracelets).toBe(28);

    // Verificar cálculo dinámico de aforo: exactamente 157 disponibles para público
    const seats = snap.seatsByEvent[escats!.id] || [];
    const capacity = computeDynamicCapacity(escats!, snap.tickets, snap.specialGuests, seats);
    expect(capacity.totalCapacity).toBe(185);
    expect(capacity.preReservedCount).toBe(28);
    expect(capacity.availableRemaining).toBe(157);
    expect(capacity.specialGuestsCount).toBe(28);
  });

  it("permite cambiar el estilo de entradas entre ÚNICO e HÍBRIDO y persistirlo reactivamente", () => {
    const targetEvent = theaterStore.getSnapshot().events.find((e) => e.id === "evt-escats-27")!;
    expect(targetEvent.ticketStyle).toBe("HIBRIDO");

    // Cambiar a ÚNICO
    const updatedUnico: TheaterEvent = {
      ...targetEvent,
      ticketStyle: "UNICO",
    };
    theaterStore.updateEvent(updatedUnico);

    const savedUnico = theaterStore.getSnapshot().events.find((e) => e.id === "evt-escats-27");
    expect(savedUnico?.ticketStyle).toBe("UNICO");

    // Cambiar de nuevo a HÍBRIDO
    const updatedHibrido: TheaterEvent = {
      ...savedUnico!,
      ticketStyle: "HIBRIDO",
    };
    theaterStore.updateEvent(updatedHibrido);

    const savedHibrido = theaterStore.getSnapshot().events.find((e) => e.id === "evt-escats-27");
    expect(savedHibrido?.ticketStyle).toBe("HIBRIDO");
  });

  it("genera exactamente 225 butacas del plano arquitectónico oficial con distribución de 3 niveles", () => {
    const seats = generateInitialSeats();
    expect(seats.length).toBe(225);

    const pb = seats.filter((s) => s.zone === "PLATEA_BAJA");
    const nm = seats.filter((s) => s.zone === "NIVEL_MEDIO");
    const bal = seats.filter((s) => s.zone === "BALCON_ALTO");

    expect(pb.length).toBe(82);
    expect(nm.length).toBe(69);
    expect(bal.length).toBe(74);

    // Verificar butacas accesibles en filas D y E
    const accessible = seats.filter((s) => s.isWheelchairAccessible);
    expect(accessible.length).toBeGreaterThan(0);
  });

  it("particiona las filas según el diseño arquitectónico de pasillos y alas del plano", () => {
    const seats = generateInitialSeats();
    const rowA = seats.filter((s) => s.row === "A");
    const rowD = seats.filter((s) => s.row === "D");
    const rowH = seats.filter((s) => s.row === "H");
    const rowM = seats.filter((s) => s.row === "M");
    const rowN = seats.filter((s) => s.row === "N");

    // Fila A: 5 en ala izquierda y 7 en ala derecha
    const splitA = splitRowByBlueprint("A", rowA);
    expect(splitA.left.length).toBe(5);
    expect(splitA.right.length).toBe(7);
    expect(splitA.hasAisle).toBe(true);

    // Fila D: 3 en ala izquierda con espacio accesible y 7 en ala derecha
    const splitD = splitRowByBlueprint("D", rowD);
    expect(splitD.left.length).toBe(3);
    expect(splitD.right.length).toBe(7);
    expect(splitD.showWheelchair).toBe(true);

    // Fila H: 7 butacas en una sola ala (espacio abierto en sector izquierdo por escaleras de descanso)
    const splitH = splitRowByBlueprint("H", rowH);
    expect(splitH.right.length).toBe(7);
    expect(splitH.left.length).toBe(0);

    // Fila M: 7 izq, 5 der, 2 exterior (asientos 13 y 14)
    const splitM = splitRowByBlueprint("M", rowM);
    expect(splitM.left.length).toBe(7);
    expect(splitM.right.length).toBe(5);
    expect(splitM.outer?.length).toBe(2);

    // Fila N: 12 continuas en balcón
    const splitN = splitRowByBlueprint("N", rowN);
    expect(splitN.left.length).toBe(12);
  });
});
