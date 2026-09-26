import React from "react";
import { QrCode, Ticket, Armchair, Shield, ArrowUpRight } from "lucide-react";
import { ActiveTab } from "./CivicHeader";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useTheaterStore } from "../../features/tickets/useTheaterStore";
import { findActiveEventForDate } from "../../features/tickets/event-date-utils";

interface AdminMobileBentoMenuProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const AdminMobileBentoMenu: React.FC<AdminMobileBentoMenuProps> = ({ onSelectTab }) => {
  const { isSuperAdmin, isProducer, isStaff, currentUser } = useAuthStore();
  const store = useTheaterStore();
  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  if (!hasStaffRole) return null;

  const currentEvent = findActiveEventForDate(store.events) || store.events[0];
  const counterData = store.braceletCountersByEvent?.[currentEvent?.id || ""] || { deliveredCount: 0 };
  const delivered = counterData.deliveredCount;
  const total = currentEvent?.totalCapacity || 220;
  const available = Math.max(0, total - delivered);

  return (
    <section className="block md:hidden px-4 mb-6">
      <div className="bg-linear-to-b from-slate-900 to-[#071324] text-white p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        {/* Cabecera Bento */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-2xs font-mono uppercase font-bold tracking-wider text-slate-300">
              Acceso Rápido Operativo
            </span>
          </div>
          <span className="text-2xs font-mono bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            {currentUser?.name || "Staff"}
          </span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Puerta / Conteo de Brazaletes (Destacado - Span 2) */}
          <button
            type="button"
            onClick={() => onSelectTab("puerta")}
            className="col-span-2 group relative p-3.5 bg-linear-to-br from-emerald-950/60 to-slate-900/90 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 text-left transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    Control de Puerta
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-2xs text-emerald-300/80">Contador & Aforo en Vivo</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-emerald-400">{delivered}</span>
                <span className="text-2xs text-slate-400 font-mono">/{total}</span>
                <span className="block text-3xs text-emerald-400/80 font-mono">
                  {available} libres
                </span>
              </div>
            </div>
          </button>

          {/* Card 2: Taquilla Express */}
          <button
            type="button"
            onClick={() => onSelectTab("taquilla")}
            className="group p-3 bg-linear-to-br from-amber-950/40 to-slate-900/90 rounded-2xl border border-amber-500/30 hover:border-amber-400 text-left transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Ticket className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Taquilla Express</h4>
            <p className="text-2xs text-amber-300/70 mt-0.5">Venta y Emisión</p>
          </button>

          {/* Card 3: Acomodadores / Sala */}
          <button
            type="button"
            onClick={() => onSelectTab("sala")}
            className="group p-3 bg-linear-to-br from-blue-950/40 to-slate-900/90 rounded-2xl border border-blue-500/30 hover:border-blue-400 text-left transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Armchair className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3 h-3 text-blue-400 opacity-60 group-hover:opacity-100" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Control de Sala</h4>
            <p className="text-2xs text-blue-300/70 mt-0.5">Acomodo en Vivo</p>
          </button>

          {/* Card 4: Panel Admin / Aforo (Span 2) */}
          <button
            type="button"
            onClick={() => onSelectTab("admin")}
            className="col-span-2 group p-2.5 bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl border border-slate-700 text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Panel Administrativo</h4>
                <p className="text-2xs text-slate-400">Configuración de Funciones y Aforo</p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};
