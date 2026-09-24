import { useState } from "react";
import { Seat, TheaterEvent } from "../tickets/types";
import { MatrixRow, CellType, buildMatrixFromSeats, convertMatrixToSeats, getOfficialPresetMatrix } from "./seat-matrix.utils";
import { Save, Sparkles, Armchair, Star, Eraser } from "lucide-react";
import { toast } from "sonner";

interface SeatMatrixDesignerProps {
  event: TheaterEvent;
  currentSeats: Seat[];
  onSaveSeats: (seats: Seat[]) => void;
}

export function SeatMatrixDesigner({ event, currentSeats, onSaveSeats }: SeatMatrixDesignerProps) {
  const [activeZone, setActiveZone] = useState<"PLATEA_BAJA" | "NIVEL_MEDIO" | "BALCON_ALTO">("PLATEA_BAJA");
  const [activeTool, setActiveTool] = useState<CellType>("SEAT");
  const [pbMatrix, setPbMatrix] = useState<MatrixRow[]>(() => buildMatrixFromSeats(currentSeats, "PLATEA_BAJA"));
  const [nmMatrix, setNmMatrix] = useState<MatrixRow[]>(() => buildMatrixFromSeats(currentSeats, "NIVEL_MEDIO"));
  const [balconMatrix, setBalconMatrix] = useState<MatrixRow[]>(() => buildMatrixFromSeats(currentSeats, "BALCON_ALTO"));

  const currentMatrix = activeZone === "PLATEA_BAJA" ? pbMatrix : activeZone === "NIVEL_MEDIO" ? nmMatrix : balconMatrix;
  const setCurrentMatrix = activeZone === "PLATEA_BAJA" ? setPbMatrix : activeZone === "NIVEL_MEDIO" ? setNmMatrix : setBalconMatrix;

  const countSeats = (m: MatrixRow[]) => m.reduce((acc, r) => acc + r.cells.filter((c) => c === "SEAT" || c === "VIP").length, 0);
  const pbCount = countSeats(pbMatrix);
  const nmCount = countSeats(nmMatrix);
  const balconCount = countSeats(balconMatrix);
  const totalCount = pbCount + nmCount + balconCount;

  const handleCellClick = (rIdx: number, cIdx: number) => {
    setCurrentMatrix((prev) =>
      prev.map((r, i) => {
        if (i !== rIdx) return r;
        const newCells = [...r.cells];
        newCells[cIdx] = newCells[cIdx] === activeTool ? "EMPTY" : activeTool;
        return { ...r, cells: newCells };
      })
    );
  };

  const handleLoadOfficialPreset = () => {
    const { plateaBaja, nivelMedio, balcon } = getOfficialPresetMatrix();
    setPbMatrix(plateaBaja);
    setNmMatrix(nivelMedio);
    setBalconMatrix(balcon);
    toast.success("Distribución oficial del Teatro Municipal cargada (220 butacas).");
  };

  const handleSave = () => {
    const newSeats = convertMatrixToSeats(pbMatrix, nmMatrix, balconMatrix);
    onSaveSeats(newSeats);
    toast.success(`Matriz guardada con éxito (${newSeats.length} butacas totales).`);
  };

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-[#1e355b] p-4 sm:p-6 shadow-sm space-y-5 transition-colors">
      {/* 1. BARRA SUPERIOR DE HERRAMIENTAS Y CONTADORES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e355b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#004ea2] dark:text-blue-400 font-bold tracking-wider">
              Diseñador de Layout de Sala
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-[#ebf3fc] dark:bg-blue-950/60 text-[#004ea2] dark:text-blue-300 border border-[#004ea2]/20">
              Aforo Total: {totalCount} / 220
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Matriz de Butacas Real • {event.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadOfficialPreset}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Preset Oficial (220)
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#c8102e] hover:bg-[#a60c25] text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Guardar Sala
          </button>
        </div>
      </div>

      {/* 2. SELECTOR DE NIVEL Y PALETA DE HERRAMIENTAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-slate-100 dark:bg-[#071324] p-1 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-xs flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveZone("PLATEA_BAJA")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeZone === "PLATEA_BAJA" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Platea ({pbCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveZone("NIVEL_MEDIO")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeZone === "NIVEL_MEDIO" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Nivel Medio ({nmCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveZone("BALCON_ALTO")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeZone === "BALCON_ALTO" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Balcón ({balconCount})
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 mr-1 hidden sm:inline">Pincel:</span>
          <button
            type="button"
            onClick={() => setActiveTool("SEAT")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-colors cursor-pointer ${
              activeTool === "SEAT" ? "bg-[#004ea2] text-white border-[#003c80]" : "bg-white dark:bg-[#071324] border-slate-200 dark:border-[#1e355b]"
            }`}
          >
            <Armchair className="w-3 h-3" /> Butaca
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("VIP")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-colors cursor-pointer ${
              activeTool === "VIP" ? "bg-[#c59223] text-white border-amber-600" : "bg-white dark:bg-[#071324] border-slate-200 dark:border-[#1e355b]"
            }`}
          >
            <Star className="w-3 h-3" /> VIP
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("EMPTY")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-colors cursor-pointer ${
              activeTool === "EMPTY" ? "bg-slate-700 text-white border-slate-900" : "bg-white dark:bg-[#071324] border-slate-200 dark:border-[#1e355b]"
            }`}
          >
            <Eraser className="w-3 h-3" /> Pasillo
          </button>
        </div>
      </div>

      {/* 3. MATRIZ DE CUADRÍCULA INTERACTIVA */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-fit flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
          <div className="w-full max-w-sm text-center py-1 mb-2 border-b-2 border-[#004ea2] text-[10px] font-mono uppercase tracking-widest text-[#004ea2] dark:text-blue-400 font-bold">
            ▲ ESCENARIO TEATRAL ▲
          </div>

          {currentMatrix.map((row, rIdx) => {
            let rowSeatNum = 1;
            return (
              <div key={row.rowLetter} className="flex items-center gap-1">
                <span className="w-5 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{row.rowLetter}</span>
                <div className="flex items-center gap-1">
                  {row.cells.map((cell, cIdx) => {
                    const isSeat = cell === "SEAT";
                    const isVip = cell === "VIP";
                    const num = isSeat || isVip ? rowSeatNum++ : null;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        title={`Fila ${row.rowLetter} Columna ${cIdx + 1} (${cell})`}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-mono text-[9px] font-bold transition-all cursor-pointer select-none ${
                          isSeat ? "bg-[#004ea2] text-white shadow-xs hover:bg-[#003c80]" : isVip ? "bg-[#c59223] text-white shadow-xs hover:bg-amber-600" : "bg-slate-200/50 dark:bg-[#0b1a30] text-slate-400 border border-dashed border-slate-300 dark:border-[#1e355b] hover:border-[#004ea2]"
                        }`}
                      >
                        {num || ""}
                      </button>
                    );
                  })}
                </div>
                <span className="w-5 text-left font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{row.rowLetter}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
