import React, { useEffect } from "react";
import { X, History, Clock, Plus, Minus } from "lucide-react";
import { BraceletLogItem } from "./bracelet-counter-types";
import { formatTimeShort } from "./bracelet-counter-utils";

interface BraceletHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: BraceletLogItem[];
}

export const BraceletHistoryModal: React.FC<BraceletHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-teatro-navy-border shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
            <h3 id="history-modal-title" className="text-xs font-bold text-slate-900 dark:text-white">
              Historial de Entregas
            </h3>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-3xs font-mono text-slate-500">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-72 overflow-y-auto space-y-1.5">
          {history.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400 font-mono">
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
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isPositive ? <Plus className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {isPositive ? `+${item.delta}` : item.delta}
                      </span>
                      {item.notes && (
                        <span className="text-3xs text-slate-400 ml-1.5 truncate">
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-2xs font-mono text-slate-400 shrink-0">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      Total: {item.totalAfter}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeShort(item.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
