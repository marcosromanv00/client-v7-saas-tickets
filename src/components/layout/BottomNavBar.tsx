import { Home, Armchair, Ticket as TicketIcon, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { ActiveTab } from "./CivicHeader";

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ticketCount: number;
}

export function BottomNavBar({ activeTab, onTabChange, ticketCount }: BottomNavBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none flex justify-center lg:hidden">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="pointer-events-auto bg-[#0d1424]/92 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl px-3 py-2 flex items-center gap-1 sm:gap-2"
      >
        {/* 1. Cartelera / Inicio */}
        <button
          type="button"
          onClick={() => onTabChange("public")}
          className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "public" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "public" && (
            <motion.div
              layoutId="activeNavPill"
              className="absolute inset-0 bg-amber-500 rounded-2xl shadow-md shadow-amber-500/30"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <Home className="w-4 h-4 relative z-10" />
          <span className="hidden sm:inline relative z-10">Cartelera</span>
        </button>

        {/* 2. Taquilla Express (Cédula) */}
        <button
          type="button"
          onClick={() => onTabChange("taquilla")}
          className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "taquilla" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "taquilla" && (
            <motion.div
              layoutId="activeNavPill"
              className="absolute inset-0 bg-amber-500 rounded-2xl shadow-md shadow-amber-500/30"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <Armchair className="w-4 h-4 relative z-10" />
          <span className="hidden sm:inline relative z-10">Taquilla Cédula</span>
        </button>

        {/* 3. Botón Central Destacado: Escáner QR de Puerta (1:1 con la referencia) */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => onTabChange("puerta")}
          className={`relative p-3.5 rounded-2xl transition-all shadow-xl -my-2.5 cursor-pointer ${
            activeTab === "puerta"
              ? "bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-300 text-slate-950 ring-4 ring-amber-500/30 shadow-amber-500/40"
              : "bg-slate-800/90 text-amber-400 border border-amber-400/40 hover:bg-slate-700/90"
          }`}
          title="Lector QR de Puerta"
          aria-label="Lector QR de Puerta"
        >
          <TicketIcon className="w-5 h-5" />
        </motion.button>

        {/* 4. Panel Productora / Admin */}
        <button
          type="button"
          onClick={() => onTabChange("admin")}
          className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "admin" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "admin" && (
            <motion.div
              layoutId="activeNavPill"
              className="absolute inset-0 bg-amber-500 rounded-2xl shadow-md shadow-amber-500/30"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <ShieldCheck className="w-4 h-4 relative z-10" />
          <span className="hidden sm:inline relative z-10">Productora</span>
          {ticketCount > 0 && (
            <span className="relative z-10 w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-amber-300">
              {ticketCount}
            </span>
          )}
        </button>
      </motion.nav>
    </div>
  );
}
