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
    <header className="sticky top-0 z-40 bg-[#0e0a16]/90 backdrop-blur-xl text-slate-100 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* MARCA E IDENTIDAD INSTITUCIONAL DEL TEATRO */}
          <div
            onClick={() => onTabChange("public")}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1b1429] border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md group-hover:border-amber-400 transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wide text-white font-medium">Teatro Municipal</span>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">1890</span>
              </div>
              <p className="text-[11px] text-zinc-400 tracking-normal hidden sm:block">Plataforma Oficial de Tiquetería y Cultura</p>
            </div>
          </div>

          {/* NAVEGACIÓN PÚBLICA PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onTabChange("public")}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "public"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Cartelera de Obras
            </button>

            {currentUser && isCitizen && (
              <button
                onClick={onOpenCitizenDrawer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <TicketIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Mis Entradas</span>
                {userTicketsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold font-mono">
                    {userTicketsCount}
                  </span>
                )}
              </button>
            )}

            {/* Acceso a Módulos Operativos para Personal */}
            {hasStaffRole && (
              <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                <button
                  onClick={() => onTabChange("taquilla")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "taquilla" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Taquilla
                </button>
                <button
                  onClick={() => onTabChange("puerta")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "puerta" ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Puerta
                </button>
                <button
                  onClick={() => onTabChange("admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeTab === "admin" ? "bg-rose-500/20 text-rose-300 font-semibold" : "text-zinc-400 hover:text-white"
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
              <div className="flex items-center gap-2 bg-[#1b1429] border border-white/10 rounded-2xl p-1 pr-2.5">
                <button
                  onClick={isCitizen ? onOpenCitizenDrawer : undefined}
                  className="flex items-center gap-2 text-xs text-white px-2 py-1"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[110px] truncate hidden sm:inline">{currentUser.name}</span>
                </button>
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1b1429] hover:bg-[#251d38] border border-white/10 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>Acceso / Mi Cuenta</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#130d20] border-b border-white/10 px-4 py-3 space-y-2">
          <button
            onClick={() => { onTabChange("public"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/5"
          >
            Cartelera de Obras
          </button>
          {currentUser && isCitizen && (
            <button
              onClick={() => { onOpenCitizenDrawer(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-white/5 flex items-center justify-between"
            >
              <span>Mis Entradas</span>
              <span className="font-mono text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">{userTicketsCount}</span>
            </button>
          )}
          {hasStaffRole && (
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-3">Módulos Administrativos</span>
              <button onClick={() => { onTabChange("taquilla"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-amber-300">Taquilla Express</button>
              <button onClick={() => { onTabChange("puerta"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-cyan-300">Lector en Puerta</button>
              <button onClick={() => { onTabChange("admin"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-rose-300">Aforo & Admins</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
