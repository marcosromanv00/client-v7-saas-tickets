import React from "react";
import { Home, Shield, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { ActiveTab } from "./CivicHeader";
import { useAuthStore } from "../../features/auth/useAuthStore";

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { isSuperAdmin, isProducer, isStaff } = useAuthStore();
  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  // En la vista pública de cartelera y butacas, nunca mostramos barras que compitan con la compra
  if (activeTab === "public") {
    return null;
  }

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 p-2 pointer-events-none flex justify-center lg:hidden">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto bg-[#171224]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-3 py-2 flex items-center gap-1.5"
      >
        <button
          type="button"
          onClick={() => onTabChange("public")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-colors ${
            activeTab === "public" ? "bg-rose-500 text-white font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Cartelera</span>
        </button>

        {hasStaffRole && (
          <>
            <button
              type="button"
              onClick={() => onTabChange("taquilla")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "taquilla" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Taquilla</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("puerta")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "puerta" ? "bg-cyan-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Puerta</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("admin")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "admin" ? "bg-rose-500 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Aforo</span>
            </button>
          </>
        )}
      </motion.nav>
    </div>
  );
};
