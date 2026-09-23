import React from "react";
import { Landmark, Ticket as TicketIcon, ScanLine, UserCheck, ShieldCheck, Menu, X } from "lucide-react";

export type ActiveTab = "public" | "taquilla" | "puerta" | "admin";

interface CivicHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  checkedInCount: number;
  totalCapacity: number;
}

export function CivicHeader({ activeTab, onTabChange, checkedInCount, totalCapacity }: CivicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "public" as ActiveTab, label: "Cartelera y Butacas", icon: TicketIcon },
    { id: "taquilla" as ActiveTab, label: "Taquilla Express", icon: UserCheck },
    { id: "puerta" as ActiveTab, label: "Lector QR en Puerta", icon: ScanLine },
    { id: "admin" as ActiveTab, label: "Panel Administrativo", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1b2a4a] text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Marca / Identidad Institucional */}
          <div 
            onClick={() => onTabChange("public")} 
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-lg bg-[#233858] border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner group-hover:border-amber-400 transition-colors">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wide text-white font-medium">Teatro Municipal</span>
                <span className="text-[11px] font-mono tracking-wider text-amber-300 uppercase px-1.5 py-0.5 rounded bg-[#233858]">Patrimonio</span>
              </div>
              <p className="text-xs text-slate-300 tracking-normal">Gestión Cívica de Tiquetería y Aforo</p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#233858] text-amber-300 shadow-sm border border-amber-400/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Indicador de Aforo en Vivo & Botón Móvil */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#121c32] border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Sala en vivo:</span>
              <span className="font-mono font-medium text-amber-300">{checkedInCount} / {totalCapacity}</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#233858]"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141f36] border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
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
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-[#233858] text-amber-300 border border-amber-400/20"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
