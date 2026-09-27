import React from "react";
import { LogIn, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../auth/useAuthStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { StaffClockInOutCard } from "./StaffClockInOutCard";
import { StaffManagementView } from "./StaffManagementView";
import { getDefaultActiveEventId, findActiveEventForDate, getUpcomingActiveEvents } from "../tickets/event-date-utils";

interface StaffDutyHubViewProps {
  onOpenLoginModal?: () => void;
}

export const StaffDutyHubView: React.FC<StaffDutyHubViewProps> = ({ onOpenLoginModal }) => {
  const { currentUser, isSuperAdmin, isProducer, isStaff } = useAuthStore();
  const store = useTheaterStore();
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const currentEvent =
    upcomingEvents[0] ||
    findActiveEventForDate(store.events) ||
    store.events.find((e) => e.id === getDefaultActiveEventId(store.events)) ||
    store.events[0];

  const hasStaffRole = isSuperAdmin || isProducer || isStaff;

  if (!currentUser || !hasStaffRole) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="p-4 rounded-3xl bg-teatro-blue/10 dark:bg-blue-500/10 border border-teatro-blue/20 dark:border-blue-500/20 inline-block text-teatro-blue dark:text-blue-400">
          <ShieldAlert className="w-10 h-10 mx-auto" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Acreditación & Registro de Turnos del Personal
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Inicie sesión con su cédula o credenciales de colaborador para registrar su hora de entrada/salida y consultar su puesto asignado (Puerta, Sala, Taquilla).
        </p>
        {onOpenLoginModal && (
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="px-5 py-2.5 bg-muni-red hover:bg-muni-red-hover text-white font-semibold rounded-2xl text-xs inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Iniciar Sesión de Personal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6">
      {/* 1. Tarjeta de Entrada / Salida (Clock-In / Clock-Out) con timer en vivo */}
      <StaffClockInOutCard currentEvent={currentEvent} />

      {/* 2. Para Superadministrador: Consola CRUD de aprobación por cédula y reasignación de puestos */}
      {isSuperAdmin && (
        <div className="pt-2">
          <StaffManagementView />
        </div>
      )}
    </div>
  );
};
