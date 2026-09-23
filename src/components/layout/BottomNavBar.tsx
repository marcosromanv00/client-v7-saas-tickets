import { Home, Armchair, Ticket as TicketIcon, ShieldCheck } from "lucide-react";
import { ActiveTab } from "./CivicHeader";

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ticketCount: number;
}

export function BottomNavBar({ activeTab, onTabChange, ticketCount }: BottomNavBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto bg-[#0d1424]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl px-3 py-2 flex items-center gap-1 sm:gap-2">
        {/* 1. Cartelera / Inicio */}
        <button
          type="button"
          onClick={() => onTabChange("public")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
            activeTab === "public"
              ? "bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Cartelera</span>
        </button>

        {/* 2. Taquilla Express (Cédula) */}
        <button
          type="button"
          onClick={() => onTabChange("taquilla")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
            activeTab === "taquilla"
              ? "bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Armchair className="w-4 h-4" />
          <span className="hidden sm:inline">Taquilla Cédula</span>
        </button>

        {/* 3. Botón Central Destacado: Escáner QR de Puerta */}
        <button
          type="button"
          onClick={() => onTabChange("puerta")}
          className={`p-3 rounded-2xl transition-all shadow-lg -my-2 ${
            activeTab === "puerta"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-105"
              : "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30"
          }`}
          title="Lector QR de Puerta"
          aria-label="Lector QR de Puerta"
        >
          <TicketIcon className="w-5 h-5" />
        </button>

        {/* 4. Panel Productora / Admin */}
        <button
          type="button"
          onClick={() => onTabChange("admin")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
            activeTab === "admin"
              ? "bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Productora</span>
          {ticketCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-amber-300">
              {ticketCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}
