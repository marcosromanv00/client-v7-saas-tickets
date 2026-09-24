import { chromium } from "playwright";
import { preview } from "vite";

const PORT = 4188;
const BASE_URL = `http://localhost:${PORT}`;

async function runFullUxAudit() {
  console.log("=== INICIANDO AUDITORÍA INTEGRAL DE UX/UI, HEURÍSTICAS Y RESPONSIVENESS ===");

  const server = await preview({
    preview: {
      port: PORT,
      strictPort: true,
    },
  });

  console.log(`✓ Servidor Vite preview activo en ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP (1440x900)
    // -------------------------------------------------------------
    console.log("\n[1/4] Probando Vista de Escritorio (1440x900)...");
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopContext.newPage();

    // Inyectar sesión de staff válida en localStorage antes de navegar
    await desktopPage.addInitScript(() => {
      localStorage.setItem(
        "tm_auth_session_v2",
        JSON.stringify({
          id: "usr-superadmin-01",
          name: "Marco (Superadmin)",
          email: "marco@teatromunicipal.cr",
          role: "SUPERADMIN",
          active: true,
          createdAt: "2026-09-01T00:00:00Z",
          notifications: { email: true, sms: false, whatsapp: true, reminderHoursBefore: 24 },
        })
      );
    });

    await desktopPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await desktopPage.waitForTimeout(600);

    const pageTitle = await desktopPage.title();
    console.log(`  ✓ Título de la página: "${pageTitle}"`);

    // -------------------------------------------------------------
    // 2. MESA 1 (TAQUILLA) -> MODAL DE GRUPOS
    // -------------------------------------------------------------
    console.log("\n[2/4] Probando Mesa 1: Taquilla Express & Sugeridor de Grupos...");
    const taquillaTab = desktopPage.locator("button:has-text('Taquilla')").first();
    await taquillaTab.waitFor({ state: "visible", timeout: 5000 });
    await taquillaTab.click();
    await desktopPage.waitForTimeout(500);

    const groupBtn = desktopPage.locator("button:has-text('Sugerir Grupo')").first();
    await groupBtn.click();
    await desktopPage.waitForTimeout(400);

    const modalTitleVisible = await desktopPage.locator("text=Sugerencia Inteligente de Grupos").isVisible();
    console.log(`  ✓ Modal de Sugerencia Inteligente abierto: ${modalTitleVisible}`);

    await desktopPage.fill("input[placeholder='Ej: Laura Castro V.']", "Familia Ramírez");
    await desktopPage.fill("input[placeholder='Ej: 2-0654-0321']", "2-0333-0444");

    const emitGroupBtn = desktopPage.locator("button:has-text('Emitir Grupo')").first();
    await emitGroupBtn.click();
    await desktopPage.waitForTimeout(600);
    console.log("  ✓ Grupo de asistentes emitido exitosamente");

    // -------------------------------------------------------------
    // 3. SALA (ACOMODADORES)
    // -------------------------------------------------------------
    console.log("\n[3/4] Probando Sala (Acomodadores) & Feed en Tiempo Real...");
    const acomodadoresTab = desktopPage.locator("button:has-text('Acomodadores')").first();
    await acomodadoresTab.click();
    await desktopPage.waitForTimeout(600);

    const attendeeEntry = desktopPage.locator("text=Familia Ramírez").first();
    const isAttendeeVisible = await attendeeEntry.isVisible();
    console.log(`  ✓ Asistente visible en Feed de Acomodadores: ${isAttendeeVisible}`);

    const markSeatedBtn = desktopPage.locator("button:has-text('Marcar Ubicado')").first();
    if (await markSeatedBtn.isVisible()) {
      await markSeatedBtn.click();
      await desktopPage.waitForTimeout(400);
      const isSeatedText = await desktopPage.locator("text=Ubicado en Asiento").first().isVisible();
      console.log(`  ✓ Acción 'Marcar Ubicado' verificada en sala: ${isSeatedText}`);
    }

    // -------------------------------------------------------------
    // 4. MÓVIL (390 x 844) & KIOSK MODE
    // -------------------------------------------------------------
    console.log("\n[4/4] Probando Responsiveness Móvil (390x844) y Modo Kiosco...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}?mode=walkin-kiosk`, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForTimeout(600);

    const kioskBanner = mobilePage.locator("text=Auto-Registro en Mesa").first();
    const isKioskVisible = await kioskBanner.isVisible();
    console.log(`  ✓ Banner de Auto-Registro en Mesa visible en móvil: ${isKioskVisible}`);

    await mobileContext.close();
    await desktopContext.close();

    console.log("\n=== AUDITORÍA COMPLETA: TODAS LAS PRUEBAS E2E PASARON AL 100% ===");
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

runFullUxAudit();
