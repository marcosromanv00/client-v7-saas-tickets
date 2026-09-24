import React from "react";
import { ScanLine } from "lucide-react";
import { motion } from "motion/react";

interface VerificationFABProps {
  onOpenVerification: () => void;
  activeTab: string;
}

export const VerificationFAB: React.FC<VerificationFABProps> = ({
  onOpenVerification,
  activeTab,
}) => {
  // Ocultar si ya estamos en la pantalla de verificación
  if (activeTab === "puerta") return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenVerification}
        type="button"
        aria-label="Acceso ultra rápido a Verificación y Lector de Puerta"
        title="Acceso ultra rápido a Verificación y Lector de Puerta"
        className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-teatro-blue hover:bg-teatro-blue-hover text-white shadow-xl shadow-blue-900/30 border border-blue-400/30 cursor-pointer transition-colors"
      >
        {/* Anillo de pulso sutil */}
        <span className="absolute -inset-1 rounded-2xl bg-blue-500/20 animate-ping opacity-60 pointer-events-none" />

        <ScanLine className="w-6 h-6 transition-transform group-hover:scale-110" />

        {/* Tooltip en hover para desktop */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Verificar Entradas (Puerta)
        </span>
      </motion.button>
    </div>
  );
};
