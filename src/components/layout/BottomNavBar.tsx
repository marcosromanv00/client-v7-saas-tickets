import React from "react";
import { Home, Shield, QrCode, Ticket, Armchair, Zap } from "lucide-react";
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

  // Solo se muestra a roles de personal / administración
  if (!hasStaffRole) {
    return null;
  }

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      tab: "home",
      label: "Inicio",
      icon: <Home className="w-5 h-5" />,
      activeColor: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md",
    },
    {
      tab: "puerta",
      label: "Puerta",
      icon: <QrCode className="w-5 h-5" />,
      activeColor: "bg-teal-600 text-white shadow-md shadow-teal-900/30",
    },
    {
      tab: "taquilla",
      label: "Taquilla",
      icon: <Zap className="w-5 h-5" />,
      activeColor: "bg-amber-500 text-white shadow-md shadow-amber-900/30",
    },
    {
      tab: "sala",
      label: "Sala",
      icon: <Armchair className="w-5 h-5" />,
      activeColor: "bg-emerald-600 text-white shadow-md shadow-emerald-900/30",
    },
    {
      tab: "public",
      label: "Cartelera",
      icon: <Ticket className="w-5 h-5" />,
      activeColor: "bg-rose-600 text-white shadow-md shadow-rose-900/30",
    },
    {
      tab: "admin",
      label: "Aforo",
      icon: <Shield className="w-5 h-5" />,
      activeColor: "bg-teatro-blue dark:bg-blue-600 text-white shadow-md shadow-blue-900/30",
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none flex justify-center lg:hidden">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto bg-white/95 dark:bg-[#071324]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#192f52] rounded-3xl shadow-2xl p-1.5 flex items-center justify-between gap-1 max-w-xs sm:max-w-md w-full transition-colors"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              title={item.label}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center justify-center h-10 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? item.activeColor
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};
