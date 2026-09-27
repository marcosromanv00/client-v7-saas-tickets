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
import { LoginModal } from "./features/auth/LoginModal";
import { CitizenAccountDrawer } from "./features/auth/CitizenAccountDrawer";
import { TicketPassModal } from "./features/tickets/TicketPassModal";
import { VerificationFAB } from "./components/layout/VerificationFAB";
import { Ticket } from "./features/tickets/types";
import { useTheme } from "./features/theme/theme-store";
import { Toaster } from "sonner";

const VALID_TABS: ActiveTab[] = ["home", "public", "taquilla", "puerta", "sala", "admin"];

function getInitialActiveTab(): ActiveTab {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace("#", "") as ActiveTab;
    if (VALID_TABS.includes(hash)) return hash;
    const saved = localStorage.getItem("tm_active_tab") as ActiveTab;
    if (saved && VALID_TABS.includes(saved)) return saved;
  }
  return "home";
}

export function App() {
  const { theme } = useTheme();
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
      const hash = window.location.hash.replace("#", "") as ActiveTab;
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem("tm_active_tab", hash);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-teatro-navy text-slate-900 dark:text-slate-100 selection:bg-teatro-blue selection:text-white dark:selection:bg-blue-600 transition-colors duration-200">
      {/* Encabezado Cívico Minimalista (Orientado a Espectadores) */}
      <CivicHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCitizenDrawer={() => setIsCitizenDrawerOpen(true)}
      />

      {/* Contenido Principal según Módulo Activo */}
      <main className="flex-1">
        {activeTab === "home" && (
          <AdminHomeMenuView onSelectTab={handleTabChange} />
        )}
        {activeTab === "public" && (
          <PublicEventView onOpenMyTickets={() => setIsCitizenDrawerOpen(true)} />
        )}
        {activeTab === "taquilla" && <TaquillaExpressView />}
        {activeTab === "puerta" && <DoorScannerView />}
        {activeTab === "sala" && <AcomodadoresLiveView />}
        {activeTab === "admin" && (
          <AdminDashboard onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        )}
      </main>

      {/* Modales y Cajones de Autenticación & Cuenta */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <CitizenAccountDrawer
        isOpen={isCitizenDrawerOpen}
        onClose={() => setIsCitizenDrawerOpen(false)}
        onSelectTicketForQr={(ticket) => setSelectedTicketForPass(ticket)}
      />

      {selectedTicketForPass && (
        <TicketPassModal
          ticket={selectedTicketForPass}
          onClose={() => setSelectedTicketForPass(null)}
        />
      )}

      {/* Barra de Navegación Inferior Flotante (Solo para Operadores de Personal) */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Botón FAB para Acceso Ultra Rápido al Verificador */}
      <VerificationFAB
        activeTab={activeTab}
        onOpenVerification={() => handleTabChange("puerta")}
      />

      {/* Notificaciones Toasts */}
      <Toaster position="top-center" richColors theme={theme} closeButton />

      {/* Pie de Página Administrativo (Oculto en Home y Wizard Público para experiencia nativa de app) */}
      {activeTab !== "public" && activeTab !== "home" && (
        <CivicFooter onSelectAdminTab={(tab) => handleTabChange(tab)} />
      )}
    </div>
  );
}

export default App;
