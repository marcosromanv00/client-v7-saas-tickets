import React, { useState } from "react";
import { Users, UserPlus, ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../auth/useAuthStore";
import { useStaffTimeStore } from "./useStaffTimeStore";
import { StaffPendingApprovalList } from "./StaffPendingApprovalList";
import { StaffActiveDutyTable } from "./StaffActiveDutyTable";
import { StaffTimeLogsTable } from "./StaffTimeLogsTable";
import { StaffRegisterModal } from "./StaffRegisterModal";
import { StaffDuty } from "./types";

export const StaffManagementView: React.FC = () => {
  const { users, currentUser, isSuperAdmin, approveStaff, rejectStaff, assignDuty, deleteAdminUser } = useAuthStore();
  const { entries } = useStaffTimeStore();
  const [subTab, setSubTab] = useState<"activos" | "pendientes" | "horarios">("activos");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const staffUsers = users.filter((u) => u.role !== "CITIZEN");
  const pendingStaff = staffUsers.filter((u) => u.approvalStatus === "PENDING_APPROVAL");
  const activeStaff = staffUsers.filter((u) => u.approvalStatus !== "PENDING_APPROVAL" && u.approvalStatus !== "REJECTED");

  const handleApprove = (staffId: string, duty: StaffDuty) => {
    approveStaff(staffId, duty);
    setToastMsg("Personal aprobado y puesto asignado con éxito.");
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleReject = (staffId: string) => {
    rejectStaff(staffId);
    setToastMsg("Solicitud rechazada.");
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAssignDuty = (staffId: string, duty: StaffDuty) => {
    assignDuty(staffId, duty);
    setToastMsg("Puesto temporal reasignado en caliente.");
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDelete = (staffId: string, name: string) => {
    if (confirm(`¿Eliminar al colaborador ${name}?`)) {
      deleteAdminUser(staffId);
      setToastMsg(`Usuario ${name} eliminado.`);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de cabecera con métricas y botón de creación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0b1a30] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teatro-blue dark:text-blue-400 font-semibold">
              Supervisión de Personal & Roles
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Gestión de Colaboradores & Acreditación por Cédula
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Validación de personal, asignación de puestos (Puerta, Sala, Taquilla) y control horario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2 bg-teatro-blue hover:bg-teatro-blue-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Nuevo Colaborador
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex bg-slate-100 dark:bg-[#071324] p-1 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-xs max-w-fit">
        <button
          type="button"
          onClick={() => setSubTab("activos")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            subTab === "activos"
              ? "bg-teatro-blue text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Personal Activo ({activeStaff.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab("pendientes")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            subTab === "pendientes"
              ? "bg-teatro-blue text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Por Validar</span>
          {pendingStaff.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              {pendingStaff.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab("horarios")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            subTab === "horarios"
              ? "bg-teatro-blue text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Bitácora de Horarios ({entries.length})
        </button>
      </div>

      {subTab === "activos" && (
        <StaffActiveDutyTable
          staffList={activeStaff}
          currentUserId={currentUser?.id}
          onAssignDuty={handleAssignDuty}
          onDeleteStaff={handleDelete}
        />
      )}

      {subTab === "pendientes" && (
        <StaffPendingApprovalList
          pendingStaff={pendingStaff}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {subTab === "horarios" && <StaffTimeLogsTable entries={entries} />}

      <StaffRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(name) => {
          setToastMsg(`Colaborador ${name} registrado con cédula.`);
          setTimeout(() => setToastMsg(null), 3500);
        }}
      />
    </div>
  );
};
