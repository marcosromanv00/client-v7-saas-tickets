import React from "react";
import { Landmark, Ticket as TicketIcon, ScanLine, UserCheck, ShieldCheck, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuthStore } from "../../features/auth/useAuthStore";

export type ActiveTab = "public" | "taquilla" | "puerta" | "admin";

interface CivicHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  checkedInCount: number;
  totalCapacity: number;
  onOpenLoginModal: () => void;
  onOpenCitizenDrawer: () => void;
}

export function CivicHeader({
  activeTab,
  onTabChange,
  checkedInCount,
  totalCapacity,
  onOpenLoginModal,
  onOpenCitizenDrawer,
}: CivicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { currentUser, isCitizen, logout } = useAuthStore();

  const navItems = [
    { id: "public" as ActiveTab, label: "Cartelera y Butacas", icon: TicketIcon },
    { id: "taquilla" as ActiveTab, label: "Taquilla Express", icon: UserCheck },
    { id: "puerta" as ActiveTab, label: "Lector en Puerta", icon: ScanLine },
    { id: "admin" as ActiveTab, label: "Productora & Aforo", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md text-slate-100 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Marca / Identidad Institucional */}
          <div 
            onClick={() => onTabChange("public")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner group-hover:border-amber-400 transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg tracking-wide text-white font-medium">Teatro Municipal</span>
                <span className="text-[11px] font-mono tracking-widest text-amber-400/80 uppercase font-medium">1890</span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-normal hidden sm:block">Plataforma Cívica de Tiquetería y Aforo</p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Aforo en Vivo & Acceso de Usuario */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Sala:</span>
              <span className="font-mono font-medium text-amber-400">{checkedInCount} / {totalCapacity}</span>
            </div>

            {/* Botón de Acceso / Usuario */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 pr-2">
                {isCitizen ? (
                  <button
                    onClick={onOpenCitizenDrawer}
                    className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 px-2 py-1 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium max-w-[100px] truncate">{currentUser.name}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-400 px-2 py-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="font-medium max-w-[110px] truncate">{currentUser.name}</span>
                  </div>
                )}
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-medium ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
