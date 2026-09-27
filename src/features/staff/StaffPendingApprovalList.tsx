import React, { useState } from "react";
import { UserAccount } from "../auth/types";
import { StaffDuty } from "./types";
import { Check, X, ShieldAlert, UserCheck } from "lucide-react";

interface StaffPendingApprovalListProps {
  pendingStaff: UserAccount[];
  onApprove: (staffId: string, duty: StaffDuty) => void;
  onReject: (staffId: string) => void;
}

export const StaffPendingApprovalList: React.FC<StaffPendingApprovalListProps> = ({
  pendingStaff,
  onApprove,
  onReject,
}) => {
  const [selectedDuties, setSelectedDuties] = useState<Record<string, StaffDuty>>({});

  if (pendingStaff.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-[#071324] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <UserCheck className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          No hay solicitudes de personal pendientes de validación
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Todas las cuentas de colaboradores han sido auditadas y aprobadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Solicitudes con Cédula Pendientes de Aprobación ({pendingStaff.length})
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl overflow-hidden bg-white dark:bg-[#0b1a30] shadow-xs">
        {pendingStaff.map((u) => {
          const duty = selectedDuties[u.id] || u.assignedDuty || "PUERTA";

          return (
            <div
              key={u.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{u.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                    Cédula: {u.citizenId || "No provista"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {u.email} {u.phone && `• Tel: ${u.phone}`} • Solicitado: {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={duty}
                  onChange={(e) =>
                    setSelectedDuties({ ...selectedDuties, [u.id]: e.target.value as StaffDuty })
                  }
                  className="px-2.5 py-1.5 bg-white dark:bg-[#071324] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="PUERTA">Asignar a: Puerta</option>
                  <option value="TAQUILLA">Asignar a: Taquilla</option>
                  <option value="SALA">Asignar a: Acomodador Sala</option>
                  <option value="INCIDENCIAS">Asignar a: Incidencias</option>
                  <option value="GENERAL">Asignar a: Supervisión</option>
                </select>

                <button
                  type="button"
                  onClick={() => onApprove(u.id, duty)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Aprobar usuario y habilitar su acceso operativo"
                >
                  <Check className="w-3.5 h-3.5" /> Aprobar
                </button>

                <button
                  type="button"
                  onClick={() => onReject(u.id)}
                  className="p-1.5 text-slate-400 hover:text-muni-red hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Rechazar solicitud"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
