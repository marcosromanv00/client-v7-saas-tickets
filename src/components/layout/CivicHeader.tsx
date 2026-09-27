import React from "react";
import { Ticket as TicketIcon, User, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useTheaterStore } from "../../features/tickets/useTheaterStore";
import { ThemeToggle } from "./ThemeToggle";
import { CivicMobileMenu } from "./CivicMobileMenu";
import { CivicDesktopNav } from "./CivicDesktopNav";
import { useIncidentStore } from "../../features/incidents/useIncidentStore";

export type ActiveTab =
  | "home"
  | "public"
  | "taquilla"
  | "puerta"
  | "sala"
  | "admin"
  | "incidencias"
  | "personal"
  | "registro-horas"
  | "reporte-incidencias";

interface CivicHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenLoginModal: () => void;
  onOpenCitizenDrawer: () => void;
}

export const CivicHeader: React.FC<CivicHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenLoginModal,
  onOpenCitizenDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { currentUser, isCitizen, isSuperAdmin, logout } = useAuthStore();
  const store = useTheaterStore();
  const { incidents } = useIncidentStore();

  const openIncidentsCount = incidents.filter((i) => i.status === "ABIERTA").length;

  const userTicketsCount = currentUser
    ? store.tickets.filter(
        (t) =>
          (currentUser.citizenId && t.citizenId === currentUser.citizenId) ||
          (currentUser.name && t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase()))
      ).length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#192f52] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* MARCA E IDENTIDAD INSTITUCIONAL: TEATRO MUNICIPAL DE ALAJUELA */}
          <div onClick={() => onTabChange("home")} className="flex items-center gap-2.5 cursor-pointer group select-none" title="Ir a inicio de centro operativo">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teatro-blue-light dark:bg-teatro-blue/20 border border-teatro-blue/30 dark:border-blue-500/30 flex items-center justify-center text-teatro-blue dark:text-blue-400 shadow-xs group-hover:scale-105 group-hover:bg-teatro-blue group-hover:text-white dark:group-hover:bg-blue-600 transition-all">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-teatro-blue dark:group-hover:text-blue-400 transition-colors block leading-tight">Teatro Municipal de Alajuela</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-normal hidden sm:block leading-none mt-0.5">Municipalidad de Alajuela • Tiquetería Oficial</p>
            </div>
          </div>

          {/* NAVEGACIÓN DESKTOP CON MODOS SUPERADMIN Y STANDALONE */}
          <CivicDesktopNav
            activeTab={activeTab}
            onTabChange={onTabChange}
            isSuperAdmin={isSuperAdmin}
            currentUser={currentUser}
            isCitizen={isCitizen}
            onOpenCitizenDrawer={onOpenCitizenDrawer}
            userTicketsCount={userTicketsCount}
            openIncidentsCount={openIncidentsCount}
          />

          {/* PERFIL & CONMUTADOR DE TEMA */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c1e36] border border-slate-200 dark:border-[#1a3357] rounded-2xl p-1 pr-2.5">
                <button onClick={isCitizen ? onOpenCitizenDrawer : undefined} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-100 px-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-teatro-blue text-white flex items-center justify-center font-bold text-[10px]">{currentUser.name.slice(0, 2).toUpperCase()}</div>
                  <span className="font-medium max-w-27.5 truncate hidden sm:inline">{currentUser.name}</span>
                </button>
                <button onClick={logout} title="Cerrar Sesión" className="p-1 text-slate-400 hover:text-muni-red rounded-lg transition-colors cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muni-red hover:bg-muni-red-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Acceso / Mi Cuenta</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (APERTURA VERTICAL) */}
      <CivicMobileMenu
        isOpen={mobileMenuOpen}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onClose={() => setMobileMenuOpen(false)}
        onOpenCitizenDrawer={onOpenCitizenDrawer}
        userTicketsCount={userTicketsCount}
      />
    </header>
  );
};
