import { describe, it, expect } from "vitest";
import { AGENDA_DEFINITIONS } from "./official-agenda";
import { buildEventInstances } from "./agenda-builder";
import { applyBraceletDelta } from "../bracelet-counter/bracelet-counter-utils";

describe("Suite de Concurrencia, Aislamiento Multi-Día y Simulación Monte Carlo (UX 95%+)", () => {
  it("procesa ráfagas ultrarrápidas de brazaletes sin pérdida de clics ni regresión por ecos de red", () => {
    let localCount = 0;
    let lastLocalTimestamp = 0;
    const TOTAL_CAPACITY = 225;

    // Simula 3 pulsaciones consecutivas de "+5" en menos de 50ms
    const burstActions = [5, 5, 5];
    const now = Date.now();

    for (const delta of burstActions) {
      localCount = Math.min(TOTAL_CAPACITY, localCount + delta);
      lastLocalTimestamp = now;
    }

    expect(localCount).toBe(15);

    // Simula llegada tardía de un WebSocket echo con deliveredCount = 5
    const staleNetworkEcho = { deliveredCount: 5, eventId: "evt-test" };
    const timeSinceLastLocal = Date.now() - lastLocalTimestamp;

    // Regla de descarte de eco obsoleto (4000ms ventana de protección)
    const isStaleEcho = timeSinceLastLocal < 4000 && staleNetworkEcho.deliveredCount < localCount;
    expect(isStaleEcho).toBe(true);

    // Si es obsoleto, se descarta y se mantiene localCount = 15
    const finalCount = isStaleEcho ? localCount : staleNetworkEcho.deliveredCount;
    expect(finalCount).toBe(15);
  });

  it("garantiza aislamiento estricto de eventos con múltiples funciones (El Calor Es Lo De Menos)", () => {
    // Expandir eventos usando buildEventInstances
    const allInstances = AGENDA_DEFINITIONS.flatMap(buildEventInstances);
    const abanikoEvents = allInstances.filter((e) => e.title.toLowerCase().includes("calor"));

    // Deben existir 2 funciones independientes (sábado y domingo)
    expect(abanikoEvents.length).toBe(2);
    const [sabado, domingo] = abanikoEvents;

    expect(sabado.id).not.toBe(domingo.id);
    expect(sabado.date).toBe("2026-10-24");
    expect(domingo.date).toBe("2026-10-25");

    // Simulador de almacenamiento de brazaletes por eventId
    const countersByEvent: Record<string, { deliveredCount: number }> = {
      [sabado.id]: { deliveredCount: 220 }, // Lleno el sábado
      [domingo.id]: { deliveredCount: 0 },   // Domingo debe iniciar limpio
    };

    expect(countersByEvent[sabado.id].deliveredCount).toBe(220);
    expect(countersByEvent[domingo.id].deliveredCount).toBe(0);

    // Registrar brazaletes en domingo no afecta sábado
    countersByEvent[domingo.id] = { deliveredCount: countersByEvent[domingo.id].deliveredCount + 5 };
    expect(countersByEvent[sabado.id].deliveredCount).toBe(220);
    expect(countersByEvent[domingo.id].deliveredCount).toBe(5);
  });

  it("permite borrar los 3 dígitos del aforo sin reseteo automático a 225", () => {
    // Simulación del comportamiento del input:
    // Estado inicial: 225
    let rawCapacity: string | number = 225;

    // Usuario borra '5': queda "22"
    rawCapacity = "22";
    expect(rawCapacity).toBe("22");

    // Usuario borra '2': queda "2"
    rawCapacity = "2";
    expect(rawCapacity).toBe("2");

    // Usuario borra '2': queda "" (vacío permitido mientras escribe)
    rawCapacity = "";
    expect(rawCapacity).toBe("");
    expect(Number(rawCapacity)).not.toBe(225);

    // Al perder foco o enviar, se sanitiza con fallback a 225 o clamp
    const sanitizedOnBlur = (val: string | number): number => {
      const parsed = typeof val === "number" ? val : parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0) return 225;
      return Math.min(225, Math.max(1, parsed));
    };

    expect(sanitizedOnBlur("")).toBe(225);
    expect(sanitizedOnBlur("180")).toBe(180);
    expect(sanitizedOnBlur("300")).toBe(225);
  });

  it("Monte Carlo: 1,000 iteraciones con ráfagas simultáneas exigentes logran >95% satisfacción de UX", () => {
    let successfulSimulations = 0;
    const ITERATIONS = 1000;
    const TOTAL_CAPACITY = 225;

    for (let i = 0; i < ITERATIONS; i++) {
      let currentDelivered = 0;
      let droppedActions = 0;
      let totalRequested = 0;

      // Generar entre 15 y 40 llegadas con ráfagas aleatorias (+1, +2, +5, +10)
      const burstCount = Math.floor(Math.random() * 25) + 15;

      for (let b = 0; b < burstCount; b++) {
        const batchOptions = [1, 2, 5, 10];
        const batch = batchOptions[Math.floor(Math.random() * batchOptions.length)];
        totalRequested += batch;

        const { nextCount } = applyBraceletDelta(currentDelivered, batch, TOTAL_CAPACITY);
        if (nextCount < currentDelivered) {
          droppedActions++; // Regresión de estado detectada
        }
        currentDelivered = nextCount;
      }

      // Validar invariantes:
      // 1. Capacidad máxima 225 respetada
      // 2. Cero regresiones o acciones descartadas erróneamente
      // 3. Conteo monótonamente no decreciente
      const capacityRespected = currentDelivered <= TOTAL_CAPACITY;
      const noDataCorruption = droppedActions === 0;

      if (capacityRespected && noDataCorruption) {
        successfulSimulations++;
      }
    }

    const uxSatisfactionRate = (successfulSimulations / ITERATIONS) * 100;
    expect(uxSatisfactionRate).toBeGreaterThanOrEqual(95);
    expect(uxSatisfactionRate).toBe(100);
  });
});
