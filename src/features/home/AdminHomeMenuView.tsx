import React, { useState } from "react";
import { QrCode, Ticket, Armchair, Shield, Calendar, Sliders, AlertTriangle, Users } from "lucide-react";
import { ActiveTab } from "../../components/layout/CivicHeader";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { useIncidentStore } from "../incidents/useIncidentStore";
import { findActiveEventForDate, getUpcomingActiveEvents } from "../tickets/event-date-utils";
import { HomeBentoCard } from "./HomeBentoCard";
import { HomeUpcomingEventsSection } from "./HomeUpcomingEventsSection";
import { EventConfigModal } from "../admin/EventConfigModal";
import { TheaterEvent } from "../tickets/types";

interface AdminHomeMenuViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  onSelectEventForBooking?: (event: TheaterEvent) => void;
}

export const AdminHomeMenuView: React.FC<AdminHomeMenuViewProps> = ({
  onSelectTab,
  onSelectEventForBooking,
}) => {
  const store = useTheaterStore();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  const { incidents } = useIncidentStore();
  const openIncidents = incidents.filter((i) => i.status === "ABIERTA").length;

  const currentEvent = findActiveEventForDate(store.events) || store.events[0];
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const counterData = store.braceletCountersByEvent?.[currentEvent?.id || ""] || { deliveredCount: 0 };
  const delivered = counterData.deliveredCount;
  const total = currentEvent?.totalCapacity || 220;
  const available = Math.max(0, total - delivered);
  const eventGuests = store.specialGuests.filter((g) => g.eventId === currentEvent?.id);
  const guestCount = eventGuests.reduce((acc, g) => acc + Math.max(0, g.ticketsCount - g.redeemedCount), 0);
  const publicCapacity = total - guestCount;

  const handleSelectEvent = (evt: TheaterEvent) => {
    if (onSelectEventForBooking) {
      onSelectEventForBooking(evt);
    }
    onSelectTab("public");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 space-y-8 animate-in fade-in duration-200">
      {/* 1. Masthead Cívico */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <span className="text-2xs font-mono uppercase tracking-widest text-teatro-blue dark:text-blue-400 font-semibold">
            Teatro Municipal de Alajuela • Panel Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white tracking-tight mt-1">
            Centro de Operaciones y Servicios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión en vivo de acceso, taquilla, acomodadores y cartelera oficial.
          </p>
        </div>

        {/* Indicador de Función de Hoy con opción de edición para admin */}
        <div
          onClick={() => canManage && setIsConfigOpen(true)}
          className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#071324] border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 ${
            canManage ? "cursor-pointer hover:border-teatro-blue/50 transition-colors" : ""
          }`}
          title={canManage ? "Toca para modificar color de brazalete y butacas disponibles" : undefined}
        >
          <span
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
            style={{ backgroundColor: currentEvent?.braceletColorHex || "#10b981" }}
          />
          <div className="text-left leading-tight">
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 uppercase">
              Hoy ({currentEvent?.date}) • {total} cupos {guestCount > 0 ? `(${publicCapacity} púb. + ${guestCount} invit.)` : ""}
              {canManage && <Sliders className="w-2.5 h-2.5 text-teatro-blue dark:text-blue-400" />}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {currentEvent?.title && currentEvent.title.length > 28 ? `${currentEvent.title.slice(0, 26)}...` : currentEvent?.title}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cuadrícula Bento Editorial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Control de Puerta & Brazaletes (Destacada en desktop) */}
        <HomeBentoCard
          title="Control de Acceso y Puerta"
          subtitle="Contador táctil de brazaletes, aforo en sala y acreditación rápida de público."
          imageSrc="/posters/theater-entrance.jpg"
          icon={<QrCode className="w-5 h-5 text-emerald-400" />}
          badge={
            <span className="px-2.5 py-1 rounded-full text-2xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
              {delivered}/{total} entregados • {available} libres {guestCount > 0 ? `(${publicCapacity} público)` : ""}
            </span>
          }
          onClick={() => onSelectTab("puerta")}
          className="sm:col-span-2 lg:col-span-2"
        />

        {/* Card 2: Taquilla Express */}
        <HomeBentoCard
          title="Taquilla Express"
          subtitle="Emisión rápida de boletos, registro express y entregas de cortesías en mostrador."
          imageSrc="/posters/theater-box-office.jpg"
          icon={<Ticket className="w-5 h-5 text-amber-400" />}
          badge={
            <span className="px-2.5 py-1 rounded-full text-2xs font-mono text-amber-300 bg-amber-500/20 border border-amber-500/30 backdrop-blur-xs">
              Ventanilla
            </span>
          }
          onClick={() => onSelectTab("taquilla")}
        />

        {/* Card 3: Control de Sala & Acomodadores */}
        <HomeBentoCard
          title="Control de Sala y Acomodadores"
          subtitle="Monitoreo de ocupación en vivo, mapa interactivo y orientación de espectadores."
          imageSrc="/posters/gala-inaugural.jpg"
          icon={<Armchair className="w-5 h-5 text-blue-400" />}
          onClick={() => onSelectTab("sala")}
        />

        {/* Card 4: Cartelera Oficial */}
        <HomeBentoCard
          title="Cartelera Oficial y Reservas"
          subtitle="Explora las 4 funciones activas de temporada, selección de butacas y reservas."
          imageSrc="/posters/sinfonica.jpg"
          icon={<Calendar className="w-5 h-5 text-rose-400" />}
          badge={
            <span className="px-2.5 py-1 rounded-full text-2xs font-mono text-white bg-muni-red/80 backdrop-blur-xs">
              Temporada 2026
            </span>
          }
          onClick={() => onSelectTab("public")}
        />

        {/* Card 5: Administración de Aforo */}
        <HomeBentoCard
          title="Administración de Aforo"
          subtitle="Configuración de funciones, cupos por zona, catálogo de brazaletes y auditoría."
          imageSrc="/posters/titeres.jpg"
          icon={<Shield className="w-5 h-5 text-indigo-400" />}
          onClick={() => onSelectTab("admin")}
        />

        {/* Card 6: Mesa de Incidencias en Sala */}
        <HomeBentoCard
          title="Mesa de Incidencias"
          subtitle="Registro ágil de contingencias, asientos duplicados y resolución en sala."
          imageSrc="/posters/theater-entrance.jpg"
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          badge={
            openIncidents > 0 ? (
              <span className="px-2.5 py-1 rounded-full text-2xs font-mono font-bold bg-rose-500/25 text-rose-300 border border-rose-500/40">
                {openIncidents} abiertas
              </span>
            ) : undefined
          }
          onClick={() => onSelectTab("incidencias")}
        />

        {/* Card 7: Personal y Control Horario */}
        <HomeBentoCard
          title="Personal & Turnos"
          subtitle="Acreditación con cédula, reloj de entrada/salida y asignación de puestos."
          imageSrc="/posters/theater-box-office.jpg"
          icon={<Users className="w-5 h-5 text-indigo-400" />}
          onClick={() => onSelectTab("personal")}
        />
      </div>

      {/* 3. Próximas 4 Funciones Oficiales */}
      <HomeUpcomingEventsSection
        events={upcomingEvents}
        onSelectEvent={handleSelectEvent}
        onGoToCartelera={() => onSelectTab("public")}
      />

      <EventConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        event={currentEvent}
        braceletColors={store.braceletColors}
        onSave={(updated) => store.updateEvent(updated)}
      />
    </div>
  );
};
