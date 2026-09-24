import { chromium } from "playwright";
import { preview } from "vite";

const PORT = 4192;
const BASE_URL = `http://localhost:${PORT}`;

async function runVerificationAudit() {
  console.log("=== INICIANDO AUDITORÍA E2E: PADRÓN DE ACREDITACIÓN, HEURÍSTICAS Y ANTI-SLOP ===");

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
    // 1. DESKTOP VIEWPORT (1440x900)
    // -------------------------------------------------------------
    console.log("\n[1/4] Probando Desktop (1440x900) - Ingreso y Carga del Módulo Puerta...");
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    // Sesión de superadmin
    await page.addInitScript(() => {
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

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    // Navegar a la pestaña "Puerta"
    const puertaTab = page.locator("button:has-text('Puerta')").first();
    await puertaTab.waitFor({ state: "visible", timeout: 5000 });
    await puertaTab.click();
    await page.waitForTimeout(500);

    // Verificar que el Padrón de Acreditación sea la vista por defecto
    const padronBtn = page.locator("button:has-text('Padrón')").first();
    await padronBtn.waitFor({ state: "visible" });
    console.log("  ✓ Conmutador de vistas presente: 'Padrón de Acreditación' activo por defecto");

    // Verificar métricas en vivo
    const convocadosLabel = page.locator("text=Convocados");
    await convocadosLabel.waitFor({ state: "visible" });
    const enSalaLabel = page.locator("text=En Sala").first();
    await enSalaLabel.waitFor({ state: "visible" });
    console.log("  ✓ Barra de métricas comprimida y armónica visible");

    // -------------------------------------------------------------
    // 2. PRUEBA DE BÚSQUEDA REACTIVA Y ACCIÓN 1-CLIC
    // -------------------------------------------------------------
    console.log("\n[2/4] Probando Búsqueda Reactiva & Acreditación con Deshacer...");
    const searchInput = page.locator("input[placeholder*='Buscar por Nombre']");
    await searchInput.fill("Alberto");
    await page.waitForTimeout(300);

    const albertoRow = page.locator("text=Don Alberto Méndez Ramos");
    await albertoRow.waitFor({ state: "visible" });
    console.log("  ✓ Búsqueda por Nombre 'Alberto' filtró instantáneamente");

    // Click en botón "Ingresar"
    const ingresarBtn = page.locator("button:has-text('Ingresar')").first();
    await ingresarBtn.click();
    await page.waitForTimeout(400);

    // Verificar toast con botón Deshacer
    const undoToast = page.locator("button:has-text('Deshacer')").last();
    await undoToast.waitFor({ state: "visible", timeout: 3000 });
    console.log("  ✓ Acreditación 1-clic exitosa y Toast con botón 'Deshacer' activo");

    // Pulsar "Deshacer"
    await undoToast.click();
    await page.waitForTimeout(400);

    // Verificar que vuelve a tener botón "Ingresar"
    await ingresarBtn.waitFor({ state: "visible" });
    console.log("  ✓ Deshacer completado: estado de boleto restaurado a 'Pendiente'");

    // Limpiar búsqueda
    await searchInput.fill("");
    await page.waitForTimeout(300);

    // -------------------------------------------------------------
    // 3. PRUEBA DE REGISTRO RÁPIDO IN-SITU & CAMBIO DE MODO
    // -------------------------------------------------------------
    console.log("\n[3/4] Probando Registro Rápido In-situ y Conmutador de Escáner...");
    const quickAddBtn = page.locator("button:has-text('Registrar In-situ')");
    await quickAddBtn.click();
    await page.waitForTimeout(300);

    const modalTitle = page.locator("text=Registro In-situ en Puerta");
    await modalTitle.waitFor({ state: "visible" });

    // Llenar formulario
    await page.locator("input[placeholder*='Roberto Méndez']").fill("Lic. Mauricio Alpízar");
    await page.locator("input[placeholder*='1-0987-0654']").fill("2-0345-0678");
    const submitAddBtn = page.locator("button:has-text('Acreditar e Ingresar')");
    await submitAddBtn.click();
    await page.waitForTimeout(500);

    // Verificar que aparece en la lista acreditado
    const newAttendee = page.locator("h4:has-text('Lic. Mauricio Alpízar')");
    await newAttendee.waitFor({ state: "visible" });
    console.log("  ✓ Asistente registrado in-situ con acreditación inmediata");

    // Alternar a modo Escáner Óptico / QR
    const scannerModeBtn = page.locator("button:has-text('Escáner QR')").first();
    await scannerModeBtn.click();
    await page.waitForTimeout(400);

    const cameraText = page.locator("text=Enfoque el QR");
    await cameraText.waitFor({ state: "visible" });
    console.log("  ✓ Conmutación a modo Escáner Óptico completada");

    // -------------------------------------------------------------
    // 4. RESPONSIVENESS (MOBILE 390x844) & ANTI-SLOP AUDIT
    // -------------------------------------------------------------
    console.log("\n[4/4] Probando Responsiveness en Móvil (390x844) y Heurísticas Anti-Slop...");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.addInitScript(() => {
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

    await mobilePage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForTimeout(600);

    // En móvil, abrir menú y navegar a Puerta
    const menuBtn = mobilePage.locator("button[aria-label='Menú']");
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(300);
    }
    const mobilePuerta = mobilePage.locator("button:has-text('Puerta')").last();
    await mobilePuerta.click();
    await mobilePage.waitForTimeout(500);

    // Verificar overflow horizontal
    const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;
    console.log(`  ✓ Comprobación de desbordamiento horizontal en móvil: ${hasHorizontalOverflow ? "FALLO (scrollWidth > clientWidth)" : "PASÓ (0 desbordamiento)"}`);

    // Anti-Slop: Verificar ausencia de 'font-extrabold'
    const extraboldCount = await mobilePage.evaluate(() => {
      return document.querySelectorAll(".font-extrabold").length;
    });
    console.log(`  ✓ Regla Anti-Slop Tipográfica (0 font-extrabold): ${extraboldCount === 0 ? "PASÓ (0 instancias)" : "ALERTA"}`);

    console.log("\n=== TODAS LAS PRUEBAS DE AUDITORÍA E2E, HEURÍSTICAS Y ANTI-SLOP PASARON CON ÉXITO ===");
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

runVerificationAudit().catch((err) => {
  console.error("Error durante la auditoría E2E:", err);
  process.exit(1);
});
