import React from "react";
import { createPortal } from "react-dom";
import { Ticket as TicketIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActiveTab } from "./CivicHeader";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useIncidentStore } from "../../features/incidents/useIncidentStore";
import {
  NavItem,
  getMainItems,
  getOpsItems,
  getAdminItems,
  getToolsItems,
} from "./civic-menu.config";
import { CivicSidebarFooter } from "./CivicSidebarFooter";

interface CivicMobileMenuProps {
  isOpen: boolean;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onClose: () => void;
  onOpenCitizenDrawer: () => void;
  userTicketsCount: number;
  onOpenLoginModal?: () => void;
}

export const CivicMobileMenu: React.FC<CivicMobileMenuProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  onOpenCitizenDrawer,
  userTicketsCount,
  onOpenLoginModal,
}) => {
  const { currentUser, isCitizen, isSuperAdmin, isProducer, isStaff, logout } = useAuthStore();
  const { incidents } = useIncidentStore();
  const openIncidentsCount = incidents.filter((i) => i.status === "ABIERTA").length;
  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onClose();
  };

  const renderItem = (item: NavItem) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
          isActive
            ? "bg-teatro-blue/10 dark:bg-teatro-blue/20 text-teatro-blue dark:text-blue-400 font-semibold border-l-2 border-teatro-blue dark:border-blue-400"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {item.icon}
          <span>{item.label}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-[#071324] border-l border-slate-200 dark:border-[#192f52] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col z-10 select-none overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 dark:border-[#192f52] flex items-center justify-between bg-slate-50/80 dark:bg-[#0b1a30]/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teatro-blue/10 dark:bg-teatro-blue/20 border border-teatro-blue/30 dark:border-blue-500/30 flex items-center justify-center text-teatro-blue dark:text-blue-400">
                  <TicketIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">Menú Principal</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Teatro Municipal de Alajuela</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                  Navegación
                </span>
                {getMainItems().map(renderItem)}
                {currentUser && isCitizen && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCitizenDrawer();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-teatro-blue dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <TicketIcon className="w-4 h-4" />
                      <span>Mis Entradas</span>
                    </div>
                    {userTicketsCount > 0 && (
                      <span className="font-mono text-2xs bg-muni-red text-white px-2 py-0.5 rounded-full font-bold">
                        {userTicketsCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {hasStaffRole && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                    Operaciones de Sala
                  </span>
                  {getOpsItems().map(renderItem)}
                </div>
              )}

              {hasStaffRole && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                    Gestión & Turnos
                  </span>
                  {getAdminItems(openIncidentsCount).map(renderItem)}
                </div>
              )}

              {hasStaffRole && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                    Herramientas de Apoyo
                  </span>
                  {getToolsItems().map(renderItem)}
                </div>
              )}
            </div>

            <CivicSidebarFooter
              currentUser={currentUser}
              onClose={onClose}
              onLogout={logout}
              onOpenLoginModal={onOpenLoginModal}
            />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
