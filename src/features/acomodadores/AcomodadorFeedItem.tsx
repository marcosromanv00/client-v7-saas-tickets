import React from "react";
import { CheckCircle2, Armchair, Clock } from "lucide-react";
import { Ticket } from "../tickets/types";

interface AcomodadorFeedItemProps {
  ticket: Ticket;
  onToggleSeated: (ticketId: string) => void;
}

export const AcomodadorFeedItem: React.FC<AcomodadorFeedItemProps> = ({
  ticket,
  onToggleSeated,
}) => {
  const formattedTime = ticket.checkedInAt
    ? new Date(ticket.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--";

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        ticket.isSeated
          ? "bg-slate-50/80 dark:bg-[#071324]/60 border-slate-200/60 dark:border-[#1a3357]/60 opacity-80"
          : "bg-white dark:bg-[#0b1a30] border-blue-200 dark:border-blue-900/60 shadow-xs ring-1 ring-blue-500/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            ticket.isSeated
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
              : "bg-blue-100 dark:bg-blue-950/60 text-teatro-blue dark:text-blue-400"
          }`}
        >
          <Armchair className="w-5 h-5" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
              {ticket.citizenName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-slate-600 dark:text-slate-300">
              {ticket.citizenId}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="font-semibold text-teatro-blue dark:text-blue-400 flex items-center gap-1">
              <Armchair className="w-3.5 h-3.5" />
              {ticket.seatLabel || "General"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </span>
            {ticket.notes && (
              <>
                <span>•</span>
                <span className="text-[11px] italic truncate max-w-48 text-slate-400">
                  {ticket.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onToggleSeated(ticket.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            ticket.isSeated
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25"
              : "bg-slate-100 dark:bg-[#071324] hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1a3357]"
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${ticket.isSeated ? "text-emerald-500" : "text-slate-400"}`} />
          <span>{ticket.isSeated ? "Ubicado en Asiento" : "Marcar Ubicado"}</span>
        </button>
      </div>
    </div>
  );
};
