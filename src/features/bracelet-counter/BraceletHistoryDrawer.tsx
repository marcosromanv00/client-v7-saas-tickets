import React, { useState } from "react";
import { History, ChevronDown, ChevronUp, Clock, Plus, Minus } from "lucide-react";
import { BraceletLogItem } from "./bracelet-counter-types";
import { formatTimeShort } from "./bracelet-counter-utils";

interface BraceletHistoryDrawerProps {
  history: BraceletLogItem[];
}

export const BraceletHistoryDrawer: React.FC<BraceletHistoryDrawerProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#071324] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
          <span>Historial de Entregas Recientes</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500">
            {history.length} registros
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-slate-100 dark:border-[#1a3357] max-h-60 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <p className="text-center py-4 text-xs text-slate-400 font-mono">
              Aún no se han registrado entregas para esta función.
            </p>
          ) : (
            history.map((item) => {
              const isPositive = item.delta > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-[#142844] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isPositive ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {isPositive ? `+${item.delta}` : item.delta} brazaletes
                      </span>
                      {item.notes && (
                        <span className="text-[10px] text-slate-400 ml-1.5 font-sans">
                          • {item.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      Total: {item.totalAfter}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeShort(item.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
