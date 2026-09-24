import React from "react";
import { Landmark, Ticket as TicketIcon, User, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useTheaterStore } from "../../features/tickets/useTheaterStore";

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-[#171717] border-b border-[#e5e1d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* MARCA E IDENTIDAD INSTITUCIONAL DEL TEATRO */}
          <div
            onClick={() => onTabChange("public")}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#fbf7ee] border border-[#b58a3a]/40 flex items-center justify-center text-[#b58a3a] shadow-sm group-hover:border-[#b58a3a] transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wide text-[#171717] font-medium">Teatro Municipal</span>
                <span className="text-[10px] font-mono tracking-widest text-[#b58a3a] uppercase font-bold">1890</span>
              </div>
              <p className="text-[11px] text-[#737373] tracking-normal hidden sm:block">Plataforma Oficial de Tiquetería y Cultura</p>
            </div>
          </div>

          {/* NAVEGACIÓN PÚBLICA PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onTabChange("public")}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "public"
                  ? "bg-[#6d174f]/10 text-[#6d174f] border border-[#6d174f]/30 font-semibold"
                  : "text-[#737373] hover:text-[#171717] hover:bg-stone-100"
              }`}
            >
              Cartelera de Obras
            </button>

            {currentUser && isCitizen && (
              <button
                onClick={onOpenCitizenDrawer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#737373] hover:text-[#171717] hover:bg-stone-100 transition-colors"
              >
                <TicketIcon className="w-3.5 h-3.5 text-[#6d174f]" />
                <span>Mis Entradas</span>
                {userTicketsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#6d174f] text-white font-bold font-mono">
                    {userTicketsCount}
                  </span>
                )}
              </button>
            )}

            {/* Acceso a Módulos Operativos para Personal */}
            {hasStaffRole && (
              <div className="flex items-center gap-1 pl-2 border-l border-[#e5e1d9]">
                <button
                  onClick={() => onTabChange("taquilla")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "taquilla" ? "bg-[#b58a3a]/15 text-[#855e14] font-semibold" : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  Taquilla
                </button>
                <button
                  onClick={() => onTabChange("puerta")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "puerta" ? "bg-teal-700/10 text-teal-800 font-semibold" : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  Puerta
                </button>
                <button
                  onClick={() => onTabChange("admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "admin" ? "bg-[#6d174f]/10 text-[#6d174f] font-semibold" : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  Aforo & Admins
                </button>
              </div>
            )}
          </nav>

          {/* PERFIL / INICIAR SESIÓN */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-50 border border-[#e5e1d9] rounded-2xl p-1 pr-2.5">
                <button
                  onClick={isCitizen ? onOpenCitizenDrawer : undefined}
                  className="flex items-center gap-2 text-xs text-[#171717] px-2 py-1"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6d174f]/15 text-[#6d174f] flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[110px] truncate hidden sm:inline">{currentUser.name}</span>
                </button>
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1 text-[#737373] hover:text-[#6d174f] rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-stone-50 border border-[#e5e1d9] text-xs font-medium text-[#171717] shadow-sm transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#6d174f]" />
                <span>Acceso / Mi Cuenta</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#737373] hover:text-[#171717] hover:bg-stone-100"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5e1d9] px-4 py-3 space-y-2">
          <button
            onClick={() => { onTabChange("public"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#171717] hover:bg-stone-100"
          >
            Cartelera de Obras
          </button>
          {currentUser && isCitizen && (
            <button
              onClick={() => { onOpenCitizenDrawer(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#6d174f] hover:bg-stone-100 flex items-center justify-between"
            >
              <span>Mis Entradas</span>
              <span className="font-mono text-[10px] bg-[#6d174f] text-white px-2 py-0.5 rounded-full">{userTicketsCount}</span>
            </button>
          )}
          {hasStaffRole && (
            <div className="pt-2 border-t border-[#e5e1d9] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] px-3">Módulos Administrativos</span>
              <button onClick={() => { onTabChange("taquilla"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-[#855e14]">Taquilla Express</button>
              <button onClick={() => { onTabChange("puerta"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-teal-800">Lector en Puerta</button>
              <button onClick={() => { onTabChange("admin"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-[#6d174f]">Aforo & Admins</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
