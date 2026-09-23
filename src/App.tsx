import { useState } from "react";
import { CivicHeader, ActiveTab } from "./components/layout/CivicHeader";
import { CivicFooter } from "./components/layout/CivicFooter";
import { PublicEventView } from "./features/seat-reservation/PublicEventView";
import { TaquillaExpressView } from "./features/taquilla-express/TaquillaExpressView";
import { DoorScannerView } from "./features/qr-access/DoorScannerView";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { useTheaterStore } from "./features/tickets/useTheaterStore";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("public");
  const store = useTheaterStore();

  const totalCapacity = 190;
  const checkedInCount = store.tickets.filter((t) => t.checkedIn).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Encabezado Único Consolidado */}
      <CivicHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        checkedInCount={checkedInCount}
        totalCapacity={totalCapacity}
      />

      {/* Contenido Principal según Capa Activa */}
      <main className="flex-1">
        {activeTab === "public" && <PublicEventView />}
        {activeTab === "taquilla" && <TaquillaExpressView />}
        {activeTab === "puerta" && <DoorScannerView />}
        {activeTab === "admin" && <AdminDashboard />}
      </main>

      {/* Pie de Página Tradicional Cívico de 4 Columnas */}
      <CivicFooter />
    </div>
  );
}

export default App;
