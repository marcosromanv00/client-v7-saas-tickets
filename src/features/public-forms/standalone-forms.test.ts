import { describe, it, expect, beforeEach } from "vitest";
import { staffTimeStore } from "../staff/staff-time-store";
import { incidentStore } from "../incidents/incident-store";

describe("Formularios Públicos Standalone y Control de Jornada", () => {
  beforeEach(() => {
    staffTimeStore.resetStore();
    incidentStore.resetStore();
  });

  describe("Registro de Horarios Standalone", () => {
    it("permite registrar entrada con cédula, evento y puesto sin credenciales", () => {
      const entry = staffTimeStore.recordDirectEntry({
        staffName: "Valeria Mora",
        staffCitizenId: "109880776",
        duty: "PUERTA",
        eventId: "evt-01",
        eventTitle: "Gala Lírica",
        clockIn: "2026-09-26T18:00:00.000Z",
        notes: "Llegada puntual",
      });

      expect(entry.id).toBeDefined();
      expect(entry.staffName).toBe("Valeria Mora");
      expect(entry.staffCitizenId).toBe("109880776");
      expect(entry.assignedDuty).toBe("PUERTA");
      expect(entry.clockOut).toBeUndefined();

      const all = staffTimeStore.getSnapshot().entries;
      expect(all.some((e) => e.id === entry.id)).toBe(true);
    });

    it("permite marcar salida posteriormente por ID de jornada", () => {
      const entry = staffTimeStore.recordDirectEntry({
        staffName: "Carlos Arguedas",
        staffCitizenId: "204560789",
        duty: "SALA",
        eventId: "evt-01",
        eventTitle: "Gala Lírica",
        clockIn: "2026-09-26T17:00:00.000Z",
      });

      const updated = staffTimeStore.clockOutById(
        entry.id,
        "2026-09-26T21:30:00.000Z",
        "Fin de función sin novedades"
      );

      expect(updated).not.toBeNull();
      expect(updated?.clockOut).toBe("2026-09-26T21:30:00.000Z");
      expect(updated?.totalMinutes).toBe(270); // 4h 30m
      expect(updated?.notes).toBe("Fin de función sin novedades");
    });
  });

  describe("Reporte de Incidencias Standalone", () => {
    it("permite registrar goteras, roturas o faltantes con título y teléfono de contacto", () => {
      const inc = incidentStore.createIncident({
        eventId: "evt-01",
        eventTitle: "Gala Lírica",
        title: "Gotera activa en techo de Balcón",
        category: "GOTERA_FILTRACION",
        severity: "CRITICA",
        locationZone: "Balcón Superior",
        seatOrArea: "Fila E junto a pasillo central",
        description: "Filtración constante de agua cayendo sobre tres butacas.",
        reportedBy: "Esteban Ramírez",
        reportedByRole: "REPORTE_PUBLICO",
        contactPhone: "8888-9999",
      });

      expect(inc.id).toBeDefined();
      expect(inc.title).toBe("Gotera activa en techo de Balcón");
      expect(inc.category).toBe("GOTERA_FILTRACION");
      expect(inc.severity).toBe("CRITICA");
      expect(inc.status).toBe("ABIERTA");
      expect(inc.contactPhone).toBe("8888-9999");

      const inStore = incidentStore.getSnapshot().incidents.find((i) => i.id === inc.id);
      expect(inStore).toBeDefined();
    });
  });
});
