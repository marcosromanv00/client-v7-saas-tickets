import { Users, Armchair } from "lucide-react";
import { ZoneId, TheaterEvent } from "../tickets/types";

interface GeneralAdmissionViewProps {
  event: TheaterEvent;
  selectedZone: ZoneId;
  onSelectZone: (zone: ZoneId) => void;
  pbReserved: number;
  balconReserved: number;
}

export function GeneralAdmissionView({
  event,
  selectedZone,
  onSelectZone,
  pbReserved,
  balconReserved,
}: GeneralAdmissionViewProps) {
  const pbAvailable = Math.max(0, event.plantaBajaCapacity - pbReserved);
  const pbPercent = Math.min(100, Math.round((pbReserved / event.plantaBajaCapacity) * 100));

  const balconAvailable = Math.max(0, event.balconCapacity - balconReserved);
  const balconPercent = Math.min(100, Math.round((balconReserved / event.balconCapacity) * 100));

  return (
    <div className="bg-[#0e1626]/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-800/80 pb-4">
        <h3 className="font-serif text-base text-white font-medium">Modalidad Aforo General (Sin Butaca Fija)</h3>
        <p className="text-xs text-slate-400 mt-1">
          La asignación de asientos se realiza por orden de llegada al entrar a sala. Seleccione su zona preferida:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zona 1: Planta Baja */}
        <div
          onClick={() => onSelectZone("PLANTA_BAJA")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
            selectedZone === "PLANTA_BAJA"
              ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/20"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-amber-400" />
              <h4 className="font-serif text-sm font-medium text-white">Platea • Planta Baja</h4>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              selectedZone === "PLANTA_BAJA" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
            }`}>
              {selectedZone === "PLANTA_BAJA" ? "Elegida" : "Seleccionar"}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Plano central al nivel del escenario. Asientos recomendados para acceso sin escalones.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Users className="w-3 h-3 text-amber-400" /> Disponibles:
              </span>
              <span className="font-mono text-white font-medium">
                {pbAvailable} / {event.plantaBajaCapacity}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${pbPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Zona 2: Balcón Superior */}
        <div
          onClick={() => onSelectZone("BALCON")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
            selectedZone === "BALCON"
              ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/20"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-indigo-400" />
              <h4 className="font-serif text-sm font-medium text-white">Balcón • Segunda Planta</h4>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              selectedZone === "BALCON" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
            }`}>
              {selectedZone === "BALCON" ? "Elegida" : "Seleccionar"}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Perspectiva aérea con excelente acústica de sala. Acceso por escalinata este.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Users className="w-3 h-3 text-indigo-400" /> Disponibles:
              </span>
              <span className="font-mono text-white font-medium">
                {balconAvailable} / {event.balconCapacity}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${balconPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
