import React, { useState, useRef } from "react";
import {
  Ticket as TicketIcon,
  ChevronDown,
  Zap,
  Armchair,
  AlertTriangle,
  Users,
  Shield,
  Clock,
  Wrench,
} from "lucide-react";
import { ActiveTab } from "./CivicHeader";
import { UserAccount } from "../../features/auth/types";

interface CivicDesktopNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isSuperAdmin: boolean;
  currentUser: UserAccount | null;
  isCitizen: boolean;
  onOpenCitizenDrawer: () => void;
  userTicketsCount: number;
  openIncidentsCount: number;
}

export const CivicDesktopNav: React.FC<CivicDesktopNavProps> = ({
  activeTab,
  onTabChange,
  isSuperAdmin,
  currentUser,
  isCitizen,
  onOpenCitizenDrawer,
  userTicketsCount,
  openIncidentsCount,
}) => {
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasStaffPrivileges = isSuperAdmin || (currentUser && currentUser.role !== "CITIZEN");

  const isOpsTabActive = [
    "taquilla",
    "puerta",
    "sala",
    "incidencias",
    "personal",
    "admin",
    "registro-horas",
    "reporte-incidencias",
  ].includes(activeTab);

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsOpsOpen(false);
  };

  const opsGroups = [
    {
      title: "Operación de Brazaletes",
      items: [
        { id: "taquilla" as ActiveTab, label: "Boletería (Entrega)", icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { id: "sala" as ActiveTab, label: "Acomodadores en Sala", icon: <Armchair className="w-4 h-4 text-blue-500" /> },
      ],
    },
    {
      title: "Gestión & Administración",
      items: [
        { id: "incidencias" as ActiveTab, label: "Mesa de Incidencias", icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, badge: openIncidentsCount },
        { id: "personal" as ActiveTab, label: "Personal & Turnos", icon: <Users className="w-4 h-4 text-indigo-500" /> },
        { id: "admin" as ActiveTab, label: "Administración de Aforo", icon: <Shield className="w-4 h-4 text-teatro-blue" /> },
      ],
    },
    {
      title: "Formularios de Apoyo",
      items: [
        { id: "registro-horas" as ActiveTab, label: "Control Horario", icon: <Clock className="w-4 h-4 text-slate-400" /> },
        { id: "reporte-incidencias" as ActiveTab, label: "Reportar Avería", icon: <Wrench className="w-4 h-4 text-slate-400" /> },
      ],
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1 relative">
      {/* 1. Inicio / Panel Central */}
      <button
        type="button"
        onClick={() => handleSelectTab("home")}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "home"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        Inicio
      </button>

      {/* 2. Cartelera Oficial de Temporada */}
      <button
        type="button"
        onClick={() => handleSelectTab("public")}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "public"
            ? "bg-teatro-blue text-white shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        Cartelera
      </button>

      {/* 3. Mis Entradas (solo para ciudadanos con sesión activa) */}
      {currentUser && isCitizen && (
        <button
          type="button"
          onClick={onOpenCitizenDrawer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <TicketIcon className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
          <span>Mis Entradas</span>
          {userTicketsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-muni-red text-white font-bold font-mono">
              {userTicketsCount}
            </span>
          )}
        </button>
      )}

      {/* 4. Menú Desplegable Consolidado de Operaciones (Staff / Admin) */}
      {hasStaffPrivileges ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpsOpen(!isOpsOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isOpsTabActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-300 dark:ring-slate-700"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <span>Operaciones</span>
            {openIncidentsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpsOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Menú Emergente de Operaciones */}
          {isOpsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpsOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {opsGroups.map((group, gIdx) => (
                  <div key={group.title} className={gIdx > 0 ? "mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80" : ""}>
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block">
                      {group.title}
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {group.items.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectTab(item.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                              isActive ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">{item.icon}<span>{item.label}</span></div>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold font-mono">{item.badge}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => handleSelectTab("admin")}
          className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          Área Operativa ➔
        </button>
      )}
    </nav>
  );
};
