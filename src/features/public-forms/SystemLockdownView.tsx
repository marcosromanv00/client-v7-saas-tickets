import React, { useState } from "react";
import { Lock, LogIn, Clock, AlertTriangle, Copy, Check, ExternalLink } from "lucide-react";

interface SystemLockdownViewProps {
  onOpenLoginModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const SystemLockdownView: React.FC<SystemLockdownViewProps> = ({
  onOpenLoginModal,
  onNavigateToTab,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = (hash: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const fullUrl = `${origin}${pathname}#${hash}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(hash);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Monograma & Candado */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm">
          <Lock className="w-8 h-8 text-teatro-blue dark:text-blue-400" />
        </div>

        {/* Encabezado Institucional */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-semibold">
            Teatro Municipal de Alajuela • Operación Restringida
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sistema Reservado por Mantenimiento
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            El acceso general se encuentra bloqueado el día de hoy. Solamente el Superadministrador puede acceder a la consola central.
          </p>
        </div>

        {/* Botón de Login Superadmin */}
        <div>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="min-h-[48px] px-6 py-3 bg-muni-red hover:bg-muni-red-hover text-white text-xs font-bold rounded-2xl inline-flex items-center gap-2 shadow-md shadow-red-900/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión como Superadministrador</span>
          </button>
        </div>

        {/* Módulos Públicos Directos para Compartir */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-left space-y-3">
          <div className="text-center sm:text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Formularios Abiertos al Personal y Colaboradores
            </h2>
            <p className="text-[11px] text-slate-400">
              Cualquier persona con el enlace puede acceder y registrar datos sin necesidad de iniciar sesión:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card Registro de Horas */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Horas de Entrada y Salida
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Marcaje de turnos por función, fecha, cédula y puesto.
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateToTab("registro-horas")}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-teatro-blue hover:bg-teatro-blue-hover text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Abrir</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard("registro-horas")}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071324] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1a3357] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  title="Copiar enlace para WhatsApp"
                >
                  {copiedLink === "registro-horas" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedLink === "registro-horas" ? "Copiado" : "Copiar"}</span>
                </button>
              </div>
            </div>

            {/* Card Reporte de Incidencias */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-muni-red dark:text-rose-400 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Reporte de Incidencias
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Notificación de goteras, roturas, faltantes y sala.
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateToTab("reporte-incidencias")}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-teatro-blue hover:bg-teatro-blue-hover text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Abrir</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard("reporte-incidencias")}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071324] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1a3357] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  title="Copiar enlace para WhatsApp"
                >
                  {copiedLink === "reporte-incidencias" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedLink === "reporte-incidencias" ? "Copiado" : "Copiar"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
