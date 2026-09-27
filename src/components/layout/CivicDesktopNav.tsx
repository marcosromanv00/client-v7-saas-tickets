import React from "react";
import { Ticket as TicketIcon } from "lucide-react";
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
  if (!isSuperAdmin) {
    return (
      <nav className="hidden md:flex items-center gap-2">
        <button
          onClick={() => onTabChange("registro-horas")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "registro-horas"
              ? "bg-teatro-blue text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Registro Horas
        </button>
        <button
          onClick={() => onTabChange("reporte-incidencias")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "reporte-incidencias"
              ? "bg-muni-red text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Reporte Incidencias
        </button>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1.5">
      <button
        onClick={() => onTabChange("home")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "home"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        Panel
      </button>

      <button
        onClick={() => onTabChange("public")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "public"
            ? "bg-teatro-blue text-white shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        Cartelera
      </button>

      {currentUser && isCitizen && (
        <button
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

      <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
        {[
          { id: "taquilla" as ActiveTab, label: "Taquilla", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold" },
          { id: "puerta" as ActiveTab, label: "Puerta", color: "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold" },
          { id: "sala" as ActiveTab, label: "Acomodadores", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold" },
          { id: "incidencias" as ActiveTab, label: "Incidencias", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold", badge: openIncidentsCount },
          { id: "personal" as ActiveTab, label: "Personal", color: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold" },
          { id: "admin" as ActiveTab, label: "Aforo & Admins", color: "bg-teatro-blue/15 text-teatro-blue dark:text-blue-300 font-semibold" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === item.id ? item.color : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="ml-1 px-1 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold font-mono">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
