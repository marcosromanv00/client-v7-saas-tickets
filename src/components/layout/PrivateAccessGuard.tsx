import React from "react";
import { ShieldCheck, LogIn, ArrowLeft } from "lucide-react";
import { ActiveTab } from "./CivicHeader";

interface PrivateAccessGuardProps {
  tabName: ActiveTab;
  onOpenLoginModal: () => void;
  onGoToPublic: () => void;
}

const TAB_LABELS: Record<string, string> = {
  taquilla: "Taquilla Express y Ventanilla",
  puerta: "Control de Acceso y Puerta",
  sala: "Control de Sala y Acomodadores",
  incidencias: "Consola de Gestión de Incidencias",
  personal: "Hub de Horarios y Personal",
  admin: "Panel de Aforo y Administración",
};

export const PrivateAccessGuard: React.FC<PrivateAccessGuardProps> = ({
  tabName,
  onOpenLoginModal,
  onGoToPublic,
}) => {
  const label = TAB_LABELS[tabName] || "Área Operativa Reservada";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-teatro-blue/10 dark:bg-blue-500/10 border border-teatro-blue/20 dark:border-blue-500/20 flex items-center justify-center text-teatro-blue dark:text-blue-400">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-2xs font-mono uppercase tracking-widest text-muni-red dark:text-red-400 font-bold">
          Capa Privada • Personal & Administración
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {label}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Esta sección está reservada exclusivamente para colaboradores, operadores de taquilla y superadministradores del Teatro Municipal de Alajuela.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenLoginModal}
          className="w-full sm:w-auto px-6 py-3 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-2xl text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-red-900/20 transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Iniciar Sesión de Personal</span>
        </button>

        <button
          type="button"
          onClick={onGoToPublic}
          className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs sm:text-sm inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir a la Cartelera Pública</span>
        </button>
      </div>
    </div>
  );
};
