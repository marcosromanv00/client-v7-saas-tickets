import React from "react";
import { QrCode, Ticket, Armchair, Shield, Calendar } from "lucide-react";
import { ActiveTab } from "../../components/layout/CivicHeader";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { findActiveEventForDate, getUpcomingActiveEvents } from "../tickets/event-date-utils";
import { HomeBentoCard } from "./HomeBentoCard";
import { HomeUpcomingEventsSection } from "./HomeUpcomingEventsSection";
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
  const currentEvent = findActiveEventForDate(store.events) || store.events[0];
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const counterData = store.braceletCountersByEvent?.[currentEvent?.id || ""] || { deliveredCount: 0 };
  const delivered = counterData.deliveredCount;
  const total = currentEvent?.totalCapacity || 220;
  const available = Math.max(0, total - delivered);

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

        {/* Indicador de Función de Hoy */}
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#071324] border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
          <span
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
            style={{ backgroundColor: currentEvent?.braceletColorHex || "#10b981" }}
          />
          <div className="text-left leading-tight">
            <span className="block text-[10px] font-mono text-slate-400 uppercase">
              Función de Hoy ({currentEvent?.date})
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {currentEvent?.title.length > 28 ? `${currentEvent.title.slice(0, 26)}...` : currentEvent?.title}
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
              {delivered}/{total} entregados • {available} libres
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
      </div>

      {/* 3. Próximas 4 Funciones Oficiales */}
      <HomeUpcomingEventsSection
        events={upcomingEvents}
        onSelectEvent={handleSelectEvent}
        onGoToCartelera={() => onSelectTab("public")}
      />
    </div>
  );
};
