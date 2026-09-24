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
import { useTheaterStore } from "./features/tickets/useTheaterStore";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("public");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCitizenDrawerOpen, setIsCitizenDrawerOpen] = useState(false);
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<Ticket | null>(null);

  const store = useTheaterStore();
  const totalCapacity = 190;
  const checkedInCount = store.tickets.filter((t) => t.checkedIn).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1538]/50 via-[#070b16] to-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Encabezado Cívico Consolidado */}
      <CivicHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        checkedInCount={checkedInCount}
        totalCapacity={totalCapacity}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCitizenDrawer={() => setIsCitizenDrawerOpen(true)}
      />

      {/* Contenido Principal según Capa Activa */}
      <main className="flex-1">
        {activeTab === "public" && <PublicEventView />}
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

      {/* Barra de Navegación Inferior Flotante (Estilo App Móvil) */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ticketCount={store.tickets.length}
      />

      {/* Notificaciones Toasts de Alta Gama */}
      <Toaster position="top-center" richColors theme="dark" closeButton />

      {/* Pie de Página Tradicional Cívico de 4 Columnas */}
      <CivicFooter />
    </div>
  );
}

export default App;
