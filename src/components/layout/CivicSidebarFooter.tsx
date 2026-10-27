import React from "react";
import { LogOut, User } from "lucide-react";
import { UserAccount } from "../../features/auth/types";
import { getRoleLabel } from "./civic-menu.config";

interface CivicSidebarFooterProps {
  currentUser: UserAccount | null;
  onClose: () => void;
  onLogout: () => void;
  onOpenLoginModal?: () => void;
}

export const CivicSidebarFooter: React.FC<CivicSidebarFooterProps> = ({
  currentUser,
  onClose,
  onLogout,
  onOpenLoginModal,
}) => {
  return (
    <div className="p-3 border-t border-slate-200 dark:border-[#192f52] bg-slate-50 dark:bg-[#0a182d]">
      {currentUser ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-9 h-9 rounded-full bg-teatro-blue text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{getRoleLabel(currentUser.role)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#071324] hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-[#1a3357] hover:border-rose-300 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            onOpenLoginModal?.();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muni-red hover:bg-muni-red-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Acceso / Iniciar Sesión</span>
        </button>
      )}
    </div>
  );
};
