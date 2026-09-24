import React from "react";
import { ShieldCheck } from "lucide-react";

interface CheckoutTermsCheckboxProps {
  acceptedTerms: boolean;
  onToggleTerms: (val: boolean) => void;
  onOpenLegalTab: (tab: "terms" | "privacy") => void;
}

export const CheckoutTermsCheckbox: React.FC<CheckoutTermsCheckboxProps> = ({
  acceptedTerms,
  onToggleTerms,
  onOpenLegalTab,
}) => {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Regla Cívica de Acceso • Corte a 15 Minutos</span>
        </div>
        <p>Las entradas son gratuitas y se liberan de forma automática si no son registradas en puerta al menos 15 minutos antes de la función.</p>
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="accept-legal"
          checked={acceptedTerms}
          onChange={(e) => onToggleTerms(e.target.checked)}
          required
          className="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-teatro-blue focus:ring-teatro-blue cursor-pointer"
        />
        <label htmlFor="accept-legal" className="text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
          Acepto los{" "}
          <button
            type="button"
            onClick={() => onOpenLegalTab("terms")}
            className="text-teatro-blue dark:text-blue-400 underline font-medium hover:text-blue-700"
          >
            Términos y Condiciones
          </button>{" "}
          y la{" "}
          <button
            type="button"
            onClick={() => onOpenLegalTab("privacy")}
            className="text-teatro-blue dark:text-blue-400 underline font-medium hover:text-blue-700"
          >
            Política de Privacidad
          </button>{" "}
          (Ley 8968).
        </label>
      </div>
    </div>
  );
};
