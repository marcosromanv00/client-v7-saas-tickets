import { useState, useEffect } from "react";
import { CivicHeader, ActiveTab } from "./components/layout/CivicHeader";
import { CivicFooter } from "./components/layout/CivicFooter";
import { BottomNavBar } from "./components/layout/BottomNavBar";
import { AdminHomeMenuView } from "./features/home/AdminHomeMenuView";
import { PublicEventView } from "./features/seat-reservation/PublicEventView";
import { TaquillaExpressView } from "./features/taquilla-express/TaquillaExpressView";
import { DoorScannerView } from "./features/qr-access/DoorScannerView";
import { AcomodadoresLiveView } from "./features/acomodadores/AcomodadoresLiveView";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { IncidentsDashboardView } from "./features/incidents/IncidentsDashboardView";
import { StaffDutyHubView } from "./features/staff/StaffDutyHubView";
import { StandaloneTimeTrackingView } from "./features/public-forms/StandaloneTimeTrackingView";
import { StandaloneIncidentReportView } from "./features/public-forms/StandaloneIncidentReportView";
import { LoginModal } from "./features/auth/LoginModal";
import { CitizenAccountDrawer } from "./features/auth/CitizenAccountDrawer";
import { TicketPassModal } from "./features/tickets/TicketPassModal";
import { VerificationFAB } from "./components/layout/VerificationFAB";
import { Ticket } from "./features/tickets/types";
import { useAuthStore } from "./features/auth/useAuthStore";
import { useTheme } from "./features/theme/theme-store";
import { Toaster } from "sonner";

import { PrivateAccessGuard } from "./components/layout/PrivateAccessGuard";

const VALID_TABS: ActiveTab[] = [
  "home", "public", "taquilla", "puerta", "sala",
  "admin", "incidencias", "personal", "registro-horas", "reporte-incidencias"
];

function normalizeHash(raw: string): ActiveTab | null {
  const clean = raw.replace("#", "").toLowerCase();
  if (clean === "horas" || clean === "turnos" || clean === "registro-horas") return "registro-horas";
  if (clean === "reporte" || clean === "incidencias-sala" || clean === "reporte-incidencias") return "reporte-incidencias";
  if (VALID_TABS.includes(clean as ActiveTab)) return clean as ActiveTab;
  return null;
}

function getInitialActiveTab(): ActiveTab {
  if (typeof window !== "undefined") {
    const fromHash = normalizeHash(window.location.hash);
    if (fromHash) return fromHash;
    const saved = localStorage.getItem("tm_active_tab");
    if (saved) {
      const fromSaved = normalizeHash(saved);
      if (fromSaved) return fromSaved;
    }
  }
  return "home";
}

export function App() {
  const { theme } = useTheme();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const canAccessPrivate = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  const [activeTab, setActiveTabState] = useState<ActiveTab>(getInitialActiveTab);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCitizenDrawerOpen, setIsCitizenDrawerOpen] = useState(false);
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<Ticket | null>(null);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("tm_active_tab", tab);
      if (window.location.hash.replace("#", "") !== tab) {
        window.location.hash = tab === "home" ? "" : tab;
      }
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const normalized = normalizeHash(window.location.hash);
      if (normalized) {
        setActiveTabState(normalized);
        localStorage.setItem("tm_active_tab", normalized);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const isStandaloneRoute = activeTab === "registro-horas" || activeTab === "reporte-incidencias";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-teatro-navy text-slate-900 dark:text-slate-100 selection:bg-teatro-blue selection:text-white dark:selection:bg-blue-600 transition-colors duration-200">
      <CivicHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCitizenDrawer={() => setIsCitizenDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* Capa 1: Formularios Públicos Standalone */}
        {activeTab === "registro-horas" && <StandaloneTimeTrackingView />}
        {activeTab === "reporte-incidencias" && <StandaloneIncidentReportView />}

        {/* Capa 2: Vistas Públicas de Cartelera & Portal Cívico */}
        {activeTab === "home" && <AdminHomeMenuView onSelectTab={handleTabChange} />}
        {activeTab === "public" && (
          <PublicEventView onOpenMyTickets={() => setIsCitizenDrawerOpen(true)} />
        )}

        {/* Capa 3: Módulos Operativos y Privados (Custodiados con PrivateAccessGuard) */}
        {!canAccessPrivate && !["home", "public", "registro-horas", "reporte-incidencias"].includes(activeTab) && (
          <PrivateAccessGuard
            tabName={activeTab}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onGoToPublic={() => handleTabChange("public")}
          />
        )}

        {canAccessPrivate && (
          <>
            {activeTab === "taquilla" && <TaquillaExpressView />}
            {activeTab === "puerta" && <DoorScannerView />}
            {activeTab === "sala" && <AcomodadoresLiveView />}
            {activeTab === "incidencias" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
                <IncidentsDashboardView />
              </div>
            )}
            {activeTab === "personal" && <StaffDutyHubView onOpenLoginModal={() => setIsLoginModalOpen(true)} />}
            {activeTab === "admin" && <AdminDashboard onOpenLoginModal={() => setIsLoginModalOpen(true)} />}
          </>
        )}
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CitizenAccountDrawer
        isOpen={isCitizenDrawerOpen}
        onClose={() => setIsCitizenDrawerOpen(false)}
        onSelectTicketForQr={(t) => setSelectedTicketForPass(t)}
      />
      {selectedTicketForPass && (
        <TicketPassModal ticket={selectedTicketForPass} onClose={() => setSelectedTicketForPass(null)} />
      )}

      {canAccessPrivate && !isStandaloneRoute && (
        <>
          <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
          <VerificationFAB activeTab={activeTab} onOpenVerification={() => handleTabChange("puerta")} />
        </>
      )}

      <Toaster position="top-center" richColors theme={theme} closeButton />

      {canAccessPrivate && activeTab !== "public" && activeTab !== "home" && !isStandaloneRoute && (
        <CivicFooter onSelectAdminTab={(tab) => handleTabChange(tab)} />
      )}
    </div>
  );
}

export default App;
