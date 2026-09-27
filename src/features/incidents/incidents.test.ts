import { describe, it, expect, beforeEach } from "vitest";
import { incidentStore } from "./incident-store";

describe("Theater Incidents System", () => {
  beforeEach(() => {
    incidentStore.resetStore();
  });

  it("debe crear una nueva incidencia con estado ABIERTA", () => {
    const inc = incidentStore.createIncident({
      eventId: "evt-01",
      eventTitle: "Gran Reapertura",
      category: "ASIENTO_DUPLICADO",
      severity: "ALTA",
      locationZone: "Platea Baja",
      seatOrArea: "Platea C-02",
      description: "Dos asistentes presentan boleto para la misma butaca.",
      reportedBy: "Carlos Puerta",
      reportedByRole: "DELEGATED_ADMIN",
    });

    expect(inc.id).toBeDefined();
    expect(inc.status).toBe("ABIERTA");
    expect(inc.severity).toBe("ALTA");
    expect(inc.category).toBe("ASIENTO_DUPLICADO");

    const all = incidentStore.getSnapshot().incidents;
    expect(all[0].id).toBe(inc.id);
  });

  it("debe resolver una incidencia registrando notas, timestamp y usuario", () => {
    const inc = incidentStore.createIncident({
      eventId: "evt-01",
      eventTitle: "Gran Reapertura",
      category: "BOLETO_EXTRAVIADO",
      severity: "MEDIA",
      locationZone: "Taquilla Express",
      description: "Espectador no encuentra su correo de confirmación.",
      reportedBy: "Sofía",
      reportedByRole: "DELEGATED_ADMIN",
    });

    const resolved = incidentStore.resolveIncident(
      inc.id,
      "Se verificó cédula y se reimprimió pase digital",
      "Marco (Superadmin)"
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.status).toBe("RESUELTA");
    expect(resolved?.resolutionNotes).toContain("reimprimió pase digital");
    expect(resolved?.resolvedBy).toBe("Marco (Superadmin)");
    expect(resolved?.resolvedAt).toBeDefined();
  });

  it("debe permitir cambiar de estado a EN_PROCESO", () => {
    const inc = incidentStore.createIncident({
      eventId: "evt-01",
      eventTitle: "Gran Reapertura",
      category: "INFRAESTRUCTURA_BUTACA",
      severity: "BAJA",
      locationZone: "Balcón",
      seatOrArea: "Balcón K-05",
      description: "Apoyabrazos flojo",
      reportedBy: "Elena",
      reportedByRole: "DELEGATED_ADMIN",
    });

    const updated = incidentStore.updateStatus(inc.id, "EN_PROCESO");
    expect(updated).toBe(true);

    const found = incidentStore.getSnapshot().incidents.find((i) => i.id === inc.id);
    expect(found?.status).toBe("EN_PROCESO");
  });

  it("debe eliminar una incidencia si fue un error de digitación", () => {
    const inc = incidentStore.createIncident({
      eventId: "evt-01",
      eventTitle: "Gran Reapertura",
      category: "OTRO",
      severity: "BAJA",
      locationZone: "Lobby",
      description: "Falsa alarma",
      reportedBy: "Carlos",
      reportedByRole: "DELEGATED_ADMIN",
    });

    const deleted = incidentStore.deleteIncident(inc.id);
    expect(deleted).toBe(true);

    const found = incidentStore.getSnapshot().incidents.find((i) => i.id === inc.id);
    expect(found).toBeUndefined();
  });
});
