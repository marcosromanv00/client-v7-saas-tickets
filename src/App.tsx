import { useState } from "react";
import { CivicHeader, ActiveTab } from "./components/layout/CivicHeader";
import { CivicFooter } from "./components/layout/CivicFooter";
import { BottomNavBar } from "./components/layout/BottomNavBar";
import { PublicEventView } from "./features/seat-reservation/PublicEventView";
import { TaquillaExpressView } from "./features/taquilla-express/TaquillaExpressView";
import { DoorScannerView } from "./features/qr-access/DoorScannerView";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { LoginModal } from "./features/auth/LoginModal";
import { CitizenAccountDrawer } from "./features/auth/CitizenAccountDrawer";
import { TicketPassModal } from "./features/tickets/TicketPassModal";
import { Ticket } from "./features/tickets/types";
import { Toaster } from "sonner";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("public");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCitizenDrawerOpen, setIsCitizenDrawerOpen] = useState(false);
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<Ticket | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0a16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(159,18,57,0.18),rgba(255,255,255,0))] text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Encabezado Cívico Minimalista (Orientado a Espectadores) */}
      <CivicHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCitizenDrawer={() => setIsCitizenDrawerOpen(true)}
      />

      {/* Contenido Principal según Módulo Activo */}
      <main className="flex-1">
        {activeTab === "public" && (
          <PublicEventView onOpenMyTickets={() => setIsCitizenDrawerOpen(true)} />
        )}
        {activeTab === "taquilla" && <TaquillaExpressView />}
        {activeTab === "puerta" && <DoorScannerView />}
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
        onTabChange={setActiveTab}
      />

      {/* Notificaciones Toasts */}
      <Toaster position="top-center" richColors theme="dark" closeButton />

      {/* Pie de Página Tradicional Cívico de 4 Columnas */}
      <CivicFooter onSelectAdminTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}

export default App;
