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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-serif text-base text-[#1b2a4a] font-medium">Modalidad de Aforo General (Sin Butaca Numerada)</h3>
        <p className="text-xs text-slate-500 mt-1">
          La asignación de asientos se realiza por orden de llegada al ingresar a la sala. Seleccione la zona de su preferencia:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zona 1: Planta Baja */}
        <div
          onClick={() => onSelectZone("PLANTA_BAJA")}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            selectedZone === "PLANTA_BAJA"
              ? "border-[#1b2a4a] bg-slate-50/80 shadow-md ring-2 ring-[#1b2a4a]/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-base font-medium text-slate-900">Planta Baja — Platea</h4>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${
              selectedZone === "PLANTA_BAJA" ? "bg-[#1b2a4a] text-white" : "bg-slate-100 text-slate-600"
            }`}>
              {selectedZone === "PLANTA_BAJA" ? "Zona Elegida" : "Seleccionar"}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Ubicación central al nivel del proscenio. Asientos de acceso cómodo recomendados para personas con movilidad reducida.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Disponibilidad:
              </span>
              <span className="font-mono font-medium text-slate-800">
                {pbAvailable} disponibles de {event.plantaBajaCapacity}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1b2a4a] h-full transition-all duration-300"
                style={{ width: `${pbPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Zona 2: Balcón Superior */}
        <div
          onClick={() => onSelectZone("BALCON")}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            selectedZone === "BALCON"
              ? "border-[#1b2a4a] bg-slate-50/80 shadow-md ring-2 ring-[#1b2a4a]/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-indigo-600" />
              <h4 className="font-serif text-base font-medium text-slate-900">Segunda Planta — Balcón</h4>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${
              selectedZone === "BALCON" ? "bg-[#1b2a4a] text-white" : "bg-slate-100 text-slate-600"
            }`}>
              {selectedZone === "BALCON" ? "Zona Elegida" : "Seleccionar"}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Vista elevada con ángulo acústico óptimo hacia el escenario. Acceso mediante escalinata este.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Disponibilidad:
              </span>
              <span className="font-mono font-medium text-slate-800">
                {balconAvailable} disponibles de {event.balconCapacity}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-700 h-full transition-all duration-300"
                style={{ width: `${balconPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
