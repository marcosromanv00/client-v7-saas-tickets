import { describe, it, expect, beforeEach } from "vitest";
import {
  registerStaffPure,
  approveStaffPure,
  rejectStaffPure,
  assignDutyPure,
} from "./staff-account-service";
import {
  staffTimeStore,
  computeWorkedMinutes,
  formatMinutesToHours,
} from "./staff-time-store";
import { UserAccount } from "../auth/types";

describe("Staff Management & Time Tracking System", () => {
  const mockUsers: UserAccount[] = [
    {
      id: "usr-admin-1",
      name: "Marco Superadmin",
      email: "marco@teatro.cr",
      role: "SUPERADMIN",
      citizenId: "305290253",
      approvalStatus: "APPROVED",
      assignedDuty: "GENERAL",
      passwordHash: "pass",
      createdAt: "2026-09-01T00:00:00Z",
      active: true,
      notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 24 },
    },
    {
      id: "usr-staff-1",
      name: "Carlos Puerta",
      email: "carlos@teatro.cr",
      role: "DELEGATED_ADMIN",
      citizenId: "115200333",
      approvalStatus: "APPROVED",
      assignedDuty: "PUERTA",
      passwordHash: "pass",
      createdAt: "2026-09-02T00:00:00Z",
      active: true,
      notifications: { email: true, sms: false, whatsapp: false, reminderHoursBefore: 24 },
    },
  ];

  beforeEach(() => {
    staffTimeStore.resetStore();
  });

  describe("1. Registro y Aprobación de Staff con Cédula", () => {
    it("debe registrar nuevo staff en estado PENDING_APPROVAL con cédula", () => {
      const res = registerStaffPure(mockUsers, {
        name: "María Acomodadora",
        email: "maria@teatro.cr",
        citizenId: "207770888",
        passwordPlain: "clave123",
        requestedDuty: "SALA",
      });

      expect(res.success).toBe(true);
      expect(res.user?.approvalStatus).toBe("PENDING_APPROVAL");
      expect(res.user?.citizenId).toBe("207770888");
      expect(res.user?.assignedDuty).toBe("SALA");
      expect(res.users.length).toBe(mockUsers.length + 1);
    });

    it("debe rechazar registro con cédula o correo duplicado", () => {
      const res = registerStaffPure(mockUsers, {
        name: "Clon de Carlos",
        email: "otro@teatro.cr",
        citizenId: "115200333", // misma cédula
        passwordPlain: "clave",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("correo o cédula");
    });

    it("el Superadmin debe poder aprobar al personal y asignarle un puesto inicial", () => {
      const reg = registerStaffPure(mockUsers, {
        name: "Elena Recepción",
        email: "elena@teatro.cr",
        citizenId: "401110222",
        passwordPlain: "clave",
      });

      const approved = approveStaffPure(reg.users, reg.user!.id, "TAQUILLA");
      expect(approved.success).toBe(true);

      const target = approved.users.find((u) => u.id === reg.user!.id);
      expect(target?.approvalStatus).toBe("APPROVED");
      expect(target?.assignedDuty).toBe("TAQUILLA");
    });

    it("el Superadmin puede rechazar una solicitud de staff", () => {
      const reg = registerStaffPure(mockUsers, {
        name: "Intruso",
        email: "intruso@teatro.cr",
        citizenId: "909990999",
        passwordPlain: "clave",
      });

      const rejected = rejectStaffPure(reg.users, reg.user!.id);
      expect(rejected.success).toBe(true);

      const target = rejected.users.find((u) => u.id === reg.user!.id);
      expect(target?.approvalStatus).toBe("REJECTED");
      expect(target?.active).toBe(false);
    });

    it("el Superadmin puede reasignar el puesto temporal en caliente", () => {
      const res = assignDutyPure(mockUsers, "usr-staff-1", "SALA");
      expect(res.success).toBe(true);

      const target = res.users.find((u) => u.id === "usr-staff-1");
      expect(target?.assignedDuty).toBe("SALA");
    });
  });

  describe("2. Control de Turnos (Clock In / Clock Out)", () => {
    it("debe registrar entrada con evento y puesto asignado", () => {
      const staffUser = mockUsers[1];
      const entry = staffTimeStore.clockIn(staffUser, "evt-01", "Gala Reapertura", "PUERTA");

      expect(entry.staffId).toBe(staffUser.id);
      expect(entry.assignedDuty).toBe("PUERTA");
      expect(entry.clockIn).toBeDefined();
      expect(entry.clockOut).toBeUndefined();

      const active = staffTimeStore.getActiveShift(staffUser.id);
      expect(active?.id).toBe(entry.id);
    });

    it("no debe crear un segundo turno abierto si ya tiene uno activo", () => {
      const staffUser = mockUsers[1];
      const first = staffTimeStore.clockIn(staffUser, "evt-01", "Gala Reapertura", "PUERTA");
      const second = staffTimeStore.clockIn(staffUser, "evt-01", "Gala Reapertura", "PUERTA");

      expect(first.id).toBe(second.id);
    });

    it("debe registrar salida calculando minutos y guardando notas", () => {
      const staffUser = mockUsers[1];
      staffTimeStore.clockIn(staffUser, "evt-01", "Gala Reapertura", "PUERTA");

      const closed = staffTimeStore.clockOut(staffUser.id, "Turno sin novedades");
      expect(closed).not.toBeNull();
      expect(closed?.clockOut).toBeDefined();
      expect(closed?.notes).toBe("Turno sin novedades");
      expect(typeof closed?.totalMinutes).toBe("number");

      const active = staffTimeStore.getActiveShift(staffUser.id);
      expect(active).toBeUndefined();
    });

    it("debe calcular minutos y formatear horas adecuadamente", () => {
      const start = new Date(Date.now() - 1000 * 60 * 95).toISOString(); // 95 min
      const end = new Date().toISOString();
      const mins = computeWorkedMinutes(start, end);

      expect(mins).toBeGreaterThanOrEqual(94);
      expect(mins).toBeLessThanOrEqual(96);

      expect(formatMinutesToHours(45)).toBe("45m");
      expect(formatMinutesToHours(95)).toBe("1h 35m");
      expect(formatMinutesToHours(120)).toBe("2h 00m");
    });
  });
});
