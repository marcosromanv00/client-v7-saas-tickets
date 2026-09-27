import React from "react";
import { UserAccount } from "../auth/types";
import { StaffDuty } from "./types";
import { Shield, Trash2, ArrowRightLeft } from "lucide-react";
import { useStaffTimeStore } from "./useStaffTimeStore";

interface StaffActiveDutyTableProps {
  staffList: UserAccount[];
  currentUserId?: string;
  onAssignDuty: (staffId: string, duty: StaffDuty) => void;
  onDeleteStaff: (staffId: string, name: string) => void;
}

export const StaffActiveDutyTable: React.FC<StaffActiveDutyTableProps> = ({
  staffList,
  currentUserId,
  onAssignDuty,
  onDeleteStaff,
}) => {
  const { getActiveShift } = useStaffTimeStore();

  return (
    <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-2xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Personal Operativo y Asignación de Puestos en Caliente ({staffList.length})
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Cambios de puesto tienen efecto inmediato en la app
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#071324] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-medium">Colaborador</th>
              <th className="py-3 px-4 font-medium">Cédula Oficial</th>
              <th className="py-3 px-4 font-medium">Puesto Temporal Asignado</th>
              <th className="py-3 px-4 font-medium">Estado de Turno</th>
              <th className="py-3 px-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {staffList.map((u) => {
              const duty = (u.assignedDuty || "GENERAL") as StaffDuty;
              const isSelf = u.id === currentUserId;
              const isSuper = u.role === "SUPERADMIN";
              const activeShift = getActiveShift(u.id);

              return (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-teatro-blue font-bold">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                      {isSelf && (
                        <span className="text-[9px] bg-teatro-blue/15 text-teatro-blue font-bold px-1.5 py-0.5 rounded">
                          Tú
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {u.citizenId || "—"}
                  </td>

                  <td className="py-3 px-4">
                    {isSuper ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muni-red/15 text-muni-red border border-muni-red/30">
                        Superadministrador General
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={duty}
                          onChange={(e) => onAssignDuty(u.id, e.target.value as StaffDuty)}
                          className="px-2 py-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                        >
                          <option value="PUERTA">🚪 Atender Puerta</option>
                          <option value="TAQUILLA">🎟️ Taquilla Express</option>
                          <option value="SALA">🛋️ Acomodador de Sala</option>
                          <option value="INCIDENCIAS">🚨 Mesa Incidencias</option>
                          <option value="GENERAL">🛡️ Supervisión General</option>
                        </select>
                        <ArrowRightLeft className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {activeShift ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En servicio
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Fuera de turno</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {!isSuper && !isSelf ? (
                      <button
                        type="button"
                        onClick={() => onDeleteStaff(u.id, u.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar usuario de staff"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Inmutable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
