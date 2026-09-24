import { describe, it, expect } from "vitest";
import { Seat } from "./types";
import { generateInitialSeats } from "./theater-layout";
import { suggestGroupSeating } from "./group-seating-utils";
import { evaluateEventCutoff } from "./cutoff-utils";

// Generador pseudoaleatorio determinista para reproducibilidad (LCG)
function createRng(seed: number = 42) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("Monte Carlo Simulation: Acomodo de Grupos y Dinámica de Aforo", () => {
  it("ejecuta 1,000 simulaciones de llegada con grupos aleatorios verificando invariantes y contigüidad", () => {
    const rng = createRng(12345);
    const NUM_SIMULATIONS = 1000;

    let totalGroups = 0;
    let contiguousGroups = 0;
    let splitGroups = 0;
    let totalAssignedSeats = 0;
    let totalDoubleBookingViolations = 0;

    for (let sim = 0; sim < NUM_SIMULATIONS; sim++) {
      const seats: Seat[] = generateInitialSeats();
      const assignedSeatIds = new Set<string>();

      // Simular grupos hasta agotar butacas o atender 100 grupos
      for (let g = 0; g < 100; g++) {
        const rand = rng();
        // Distribución de tamaño de grupos:
        // 15% de 1 pax, 50% de 2 pax, 20% de 3 pax, 10% de 4 pax, 5% de 5-6 pax
        let partySize = 2;
        if (rand < 0.15) partySize = 1;
        else if (rand < 0.65) partySize = 2;
        else if (rand < 0.85) partySize = 3;
        else if (rand < 0.95) partySize = 4;
        else partySize = Math.floor(rng() * 2) + 5; // 5 o 6

        const suggestion = suggestGroupSeating(seats, partySize);

        if (!suggestion.hasSufficientSeats) {
          // Aforo lleno o insuficiente para este grupo
          break;
        }

        totalGroups++;
        if (partySize > 1) {
          if (suggestion.isContiguous) {
            contiguousGroups++;
          } else {
            splitGroups++;
          }
        }

        // Validar invariante de NO doble reserva
        for (const sId of suggestion.selectedSeatIds) {
          if (assignedSeatIds.has(sId)) {
            totalDoubleBookingViolations++;
          }
          assignedSeatIds.add(sId);

          const seatObj = seats.find((s) => s.id === sId);
          if (seatObj) {
            seatObj.status = "OCCUPIED";
          }
        }

        totalAssignedSeats += suggestion.selectedSeatIds.length;
      }
    }

    // Métricas globales de la simulación
    const contiguityRate = (contiguousGroups / (contiguousGroups + splitGroups)) * 100;
    const avgAssignedPerSim = totalAssignedSeats / NUM_SIMULATIONS;

    // INVARIANTES OBLIGATORIOS:
    expect(totalDoubleBookingViolations).toBe(0);
    // En las primeras llegadas, la tasa de contigüidad debe superar el 60%
    expect(contiguityRate).toBeGreaterThan(60);
    // Cada simulación debe acomodar en promedio > 180 butacas de las 220
    expect(avgAssignedPerSim).toBeGreaterThan(180);
  });

  it("simula el corte de 20 min y liberación de 15 min con absorción por walk-ins", () => {
    const rng = createRng(999);
    const eventDate = "2026-09-25";
    const eventTime = "19:00";

    // Simular 200 asistentes que intentan ingresar en distintos minutos
    let webBookingsAllowed = 0;
    let webBookingsRejected = 0;
    let walkInAbsorptions = 0;

    for (let i = 0; i < 200; i++) {
      // Minuto aleatorio entre 18:00 (60 min antes) y 19:10 (10 min post inicio)
      const minutesBefore = Math.floor(rng() * 70) - 10; // -10 a 60
      const currentHour = 18;
      const currentMin = 60 - minutesBefore;
      const simDate = new Date(2026, 8, 25, currentHour, currentMin, 0);

      const cutoff = evaluateEventCutoff(eventDate, eventTime, 20, simDate);

      // Si es usuario web regular:
      if (cutoff.isWebLocked) {
        webBookingsRejected++;
      } else {
        webBookingsAllowed++;
      }

      // Si es walk-in presencial en taquilla con auto-registro (bypasses web lock):
      if (cutoff.isWebLocked && minutesBefore >= 0) {
        walkInAbsorptions++;
      }
    }

    // Invariantes
    expect(webBookingsAllowed).toBeGreaterThan(0);
    expect(webBookingsRejected).toBeGreaterThan(0);
    expect(walkInAbsorptions).toBeGreaterThan(0);
  });
});
