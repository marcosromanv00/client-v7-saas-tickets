import React from "react";
import { Ticket as TicketIcon, User, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useTheaterStore } from "../../features/tickets/useTheaterStore";
import { ThemeToggle } from "./ThemeToggle";

export type ActiveTab = "public" | "taquilla" | "puerta" | "admin";

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
  const { currentUser, isCitizen, isSuperAdmin, isProducer, isStaff, logout } = useAuthStore();
  const store = useTheaterStore();

  const userTicketsCount = currentUser
    ? store.tickets.filter(
        (t) =>
          (currentUser.citizenId && t.citizenId === currentUser.citizenId) ||
          (currentUser.name && t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase()))
      ).length
    : 0;

  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#192f52] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* MARCA E IDENTIDAD INSTITUCIONAL: TEATRO MUNICIPAL DE ALAJUELA */}
          <div
            onClick={() => onTabChange("public")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="Ir a inicio de cartelera"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#ebf3fc] dark:bg-[#004ea2]/20 border border-[#004ea2]/30 dark:border-blue-500/30 flex items-center justify-center text-[#004ea2] dark:text-blue-400 shadow-xs group-hover:scale-105 group-hover:bg-[#004ea2] group-hover:text-white dark:group-hover:bg-blue-600 transition-all">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-[#004ea2] dark:group-hover:text-blue-400 transition-colors block leading-tight">
                Teatro Municipal de Alajuela
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-normal hidden sm:block leading-none mt-0.5">
                Municipalidad de Alajuela • Tiquetería Oficial
              </p>
            </div>
          </div>

          {/* NAVEGACIÓN PÚBLICA PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onTabChange("public")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "public"
                  ? "bg-[#004ea2] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              Cartelera de Obras
            </button>

            {currentUser && isCitizen && (
              <button
                onClick={onOpenCitizenDrawer}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <TicketIcon className="w-3.5 h-3.5 text-[#004ea2] dark:text-blue-400" />
                <span>Mis Entradas</span>
                {userTicketsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#c8102e] text-white font-bold font-mono">
                    {userTicketsCount}
                  </span>
                )}
              </button>
            )}

            {/* Acceso a Módulos Operativos para Personal */}
            {hasStaffRole && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => onTabChange("taquilla")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "taquilla"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Taquilla
                </button>
                <button
                  onClick={() => onTabChange("puerta")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "puerta"
                      ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Puerta
                </button>
                <button
                  onClick={() => onTabChange("admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-[#004ea2]/15 text-[#004ea2] dark:text-blue-300 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Aforo & Admins
                </button>
              </div>
            )}
          </nav>

          {/* PERFIL & CONMUTADOR DE TEMA */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c1e36] border border-slate-200 dark:border-[#1a3357] rounded-2xl p-1 pr-2.5">
                <button onClick={isCitizen ? onOpenCitizenDrawer : undefined} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-100 px-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-[#004ea2] text-white flex items-center justify-center font-bold text-[10px]">{currentUser.name.slice(0, 2).toUpperCase()}</div>
                  <span className="font-medium max-w-[110px] truncate hidden sm:inline">{currentUser.name}</span>
                </button>
                <button onClick={logout} title="Cerrar Sesión" className="p-1 text-slate-400 hover:text-[#c8102e] rounded-lg transition-colors cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#c8102e] hover:bg-[#a60c25] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
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

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-[#192f52] px-4 py-3 space-y-2">
          <button
            onClick={() => { onTabChange("public"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cartelera de Obras
          </button>
          {currentUser && isCitizen && (
            <button
              onClick={() => { onOpenCitizenDrawer(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#004ea2] dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Mis Entradas</span>
              <span className="font-mono text-[10px] bg-[#c8102e] text-white px-2 py-0.5 rounded-full">{userTicketsCount}</span>
            </button>
          )}
          {hasStaffRole && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 px-3">Módulos Administrativos</span>
              <button onClick={() => { onTabChange("taquilla"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400">Taquilla Express</button>
              <button onClick={() => { onTabChange("puerta"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-teal-600 dark:text-teal-400">Lector en Puerta</button>
              <button onClick={() => { onTabChange("admin"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-[#004ea2] dark:text-blue-400">Aforo & Admins</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
