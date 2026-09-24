import React, { useState, useMemo } from "react";
import { X, Users, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Seat, TheaterEvent } from "../tickets/types";
import { suggestGroupSeating } from "../tickets/group-seating-utils";

interface GroupSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TheaterEvent;
  seats: Seat[];
  onApplyToMatrix: (seatIds: string[]) => void;
  onConfirmBatch: (data: {
    leaderName: string;
    leaderId: string;
    seatIds: string[];
  }) => { success: boolean; error?: string };
}

export const GroupSuggestionModal: React.FC<GroupSuggestionModalProps> = ({
  isOpen,
  onClose,
  event,
  seats,
  onApplyToMatrix,
  onConfirmBatch,
}) => {
  const [headcount, setHeadcount] = useState<number>(2);
  const [leaderName, setLeaderName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const suggestion = useMemo(() => {
    return suggestGroupSeating(seats, headcount);
  }, [seats, headcount]);

  if (!isOpen) return null;

  const handleApplyToMatrix = () => {
    onApplyToMatrix(suggestion.selectedSeatIds);
    onClose();
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!leaderName.trim() || !leaderId.trim()) {
      setError("Complete el nombre y cédula del responsable del grupo.");
      return;
    }
    if (suggestion.selectedSeatIds.length === 0) {
      setError("No hay butacas disponibles para emitir.");
      return;
    }

    const res = onConfirmBatch({
      leaderName,
      leaderId,
      seatIds: suggestion.selectedSeatIds,
    });

    if (res.success) {
      setLeaderName("");
      setLeaderId("");
      onClose();
    } else {
      setError(res.error || "Error al emitir boletos grupales.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-teatro-navy-border overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teatro-blue dark:text-blue-400" />
            <h3 className="text-base font-bold tracking-tight">Sugerencia Inteligente de Grupos</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDirectSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-[#071324] p-3 rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Asignación bajo 1 sola cédula con check-in y acomodo automático.</p>
          </div>

          <div>
            <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cantidad de Personas ({headcount})</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHeadcount(num)}
                  className={`flex-1 py-2 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    headcount === num
                      ? "bg-teatro-blue text-white border-teatro-blue shadow-xs"
                      : "bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Titular del Grupo</label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Ej: Laura Castro V."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1 font-medium">Cédula del Titular</label>
              <input
                type="text"
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                placeholder="Ej: 2-0654-0321"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teatro-blue"
                required
              />
            </div>
          </div>

          {/* Caja de recomendación del algoritmo */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-[#08182f] rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-teatro-blue dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sugerencia Algorítmica
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                suggestion.isContiguous ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40" : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300/40"
              }`}>
                {suggestion.isContiguous ? "Contiguos (Misma Fila)" : "Filas Cercanas"}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {suggestion.explanation}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestion.subgroups.map((sg, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg bg-white dark:bg-[#071324] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200">
                  {sg.description}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={handleApplyToMatrix}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer text-center"
            >
              Ver en Matriz de Sala
            </button>
            <button
              type="submit"
              disabled={!suggestion.hasSufficientSeats}
              className="flex-1 py-2.5 px-4 bg-muni-red hover:bg-muni-red-hover disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Emitir Grupo ({headcount})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
