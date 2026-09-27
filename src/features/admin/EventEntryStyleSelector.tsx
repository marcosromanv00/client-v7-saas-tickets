import React from "react";
import { TicketStyle } from "../tickets/types";
import { Sparkles, Ticket } from "lucide-react";

interface EventEntryStyleSelectorProps {
  ticketStyle: TicketStyle;
  onChangeStyle: (style: TicketStyle) => void;
}

export const EventEntryStyleSelector: React.FC<EventEntryStyleSelectorProps> = ({
  ticketStyle,
  onChangeStyle,
}) => {
  return (
    <div>
      <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium text-xs">
        Estilo de Entradas
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChangeStyle("HIBRIDO")}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            ticketStyle === "HIBRIDO"
              ? "bg-teatro-blue text-white font-semibold border-teatro-blue-hover shadow-xs"
              : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold block text-xs">Híbrido (Oficial)</span>
          </div>
          <span className="text-[10px] opacity-80 block mt-0.5">Boleto Digital + Brazalete</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStyle("UNICO")}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            ticketStyle === "UNICO"
              ? "bg-teatro-blue text-white font-semibold border-teatro-blue-hover shadow-xs"
              : "bg-slate-50 dark:bg-[#071324] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5" />
            <span className="font-semibold block text-xs">Estilo Único</span>
          </div>
          <span className="text-[10px] opacity-80 block mt-0.5">Solo Brazalete o Solo QR</span>
        </button>
      </div>
    </div>
  );
};
