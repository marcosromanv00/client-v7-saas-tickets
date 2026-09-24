import { describe, it, expect, beforeEach } from "vitest";
import { authStore } from "./auth-store";
import { auditLogStore } from "./audit-logger";

describe("Auth & RBAC Store", () => {
  beforeEach(() => {
    authStore.logout();
  });

  it("authenticates Superadmin with valid credentials", () => {
    const res = authStore.login("marco@teatromunicipal.cr", "admin2026");
    expect(res.success).toBe(true);
    expect(res.user?.role).toBe("SUPERADMIN");
    expect(authStore.getSnapshot().currentUser?.email).toBe("marco@teatromunicipal.cr");
  });

  it("fails login with incorrect password and logs a warning audit event", () => {
    const prevLogsCount = auditLogStore.getSnapshot().length;
    const res = authStore.login("marco@teatromunicipal.cr", "wrongpass");
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();

    const newLogs = auditLogStore.getSnapshot();
    expect(newLogs.length).toBeGreaterThan(prevLogsCount);
    expect(newLogs[0].action).toBe("AUTH_LOGIN");
    expect(newLogs[0].severity).toBe("WARNING");
  });

  it("allows Superadmin to create a new delegated admin", () => {
    authStore.login("marco@teatromunicipal.cr", "admin2026");
    const newAdmin = authStore.createAdminUser({
      name: "Juan Puerta Sur",
      email: "juan.sur@teatromunicipal.cr",
      passwordPlain: "puerta2026",
      role: "DELEGATED_ADMIN",
    });

    expect(newAdmin.success).toBe(true);
    expect(newAdmin.user?.name).toBe("Juan Puerta Sur");

    // Verify login with new admin credentials
    const loginRes = authStore.login("juan.sur@teatromunicipal.cr", "puerta2026");
    expect(loginRes.success).toBe(true);
    expect(loginRes.user?.role).toBe("DELEGATED_ADMIN");
  });

  it("prevents deleting the Superadmin account", () => {
    authStore.login("marco@teatromunicipal.cr", "admin2026");
    const superAdmin = authStore.getSnapshot().users.find((u) => u.role === "SUPERADMIN")!;
    const delRes = authStore.deleteAdminUser(superAdmin.id);
    expect(delRes.success).toBe(false);
  });

  it("registers a citizen and initializes notification preferences", () => {
    const res = authStore.registerCitizen({
      name: "Valeria Mora",
      email: "valeria@gmail.com",
      citizenId: "1-1823-0492",
      passwordPlain: "valeria123",
    });

    expect(res.success).toBe(true);
    expect(res.user?.role).toBe("CITIZEN");
    expect(res.user?.notifications.whatsapp).toBe(true);
    expect(res.user?.notifications.email).toBe(true);
  });
});
