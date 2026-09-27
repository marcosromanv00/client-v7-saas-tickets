import React from "react";
import { Home, Ticket as TicketIcon, QrCode, Zap, Armchair, Shield } from "lucide-react";
import { ActiveTab } from "./CivicHeader";
import { useAuthStore } from "../../features/auth/useAuthStore";

interface CivicMobileMenuProps {
  isOpen: boolean;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onClose: () => void;
  onOpenCitizenDrawer: () => void;
  userTicketsCount: number;
}

export const CivicMobileMenu: React.FC<CivicMobileMenuProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  onOpenCitizenDrawer,
  userTicketsCount,
}) => {
  const { currentUser, isCitizen, isSuperAdmin, isProducer, isStaff } = useAuthStore();
  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  if (!isOpen) return null;

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <div className="md:hidden bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-[#192f52] px-4 py-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
      <button
        onClick={() => handleSelect("home")}
        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
          activeTab === "home"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
            : "text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <Home className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
        <span>Panel Central / Inicio</span>
      </button>

      <button
        onClick={() => handleSelect("public")}
        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
          activeTab === "public"
            ? "bg-teatro-blue text-white shadow-xs"
            : "text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <TicketIcon className="w-4 h-4 text-rose-500" />
        <span>Cartelera de Obras</span>
      </button>

      {currentUser && isCitizen && (
        <button
          onClick={() => {
            onOpenCitizenDrawer();
            onClose();
          }}
          className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-teatro-blue dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
        >
          <span>Mis Entradas</span>
          <span className="font-mono text-2xs bg-muni-red text-white px-2 py-0.5 rounded-full">
            {userTicketsCount}
          </span>
        </button>
      )}

      {hasStaffRole && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 px-3 block mb-1">
            Módulos de Personal (Apertura Vertical)
          </span>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleSelect("puerta")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "puerta"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Control de Puerta & Brazaletes</span>
            </button>

            <button
              onClick={() => handleSelect("taquilla")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "taquilla"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Taquilla Express & Venta</span>
            </button>

            <button
              onClick={() => handleSelect("sala")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "sala"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Armchair className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Control de Sala & Acomodadores</span>
            </button>

            <button
              onClick={() => handleSelect("admin")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "admin"
                  ? "bg-teatro-blue text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Shield className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
              <span>Administración de Aforo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
