import React, { useState, useMemo, useEffect } from "react";
import { Users, Undo2, CheckCircle2 } from "lucide-react";
import { TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { AttendeeFilterState, AttendeeItem } from "./attendee-types";
import { buildAttendeeList, filterAndSortAttendees, computeAttendeeMetrics } from "./attendee-utils";
import { AttendeeMetricsBar } from "./AttendeeMetricsBar";
import { AttendeeFilterBar } from "./AttendeeFilterBar";
import { AttendeeCard } from "./AttendeeCard";
import { QuickAddAttendeeModal } from "./QuickAddAttendeeModal";

interface AttendeeVerificationViewProps {
  currentEvent: TheaterEvent;
}

export const AttendeeVerificationView: React.FC<AttendeeVerificationViewProps> = ({
  currentEvent,
}) => {
  const store = useTheaterStore();
  const [filters, setFilters] = useState<AttendeeFilterState>({
    searchQuery: "",
    statusFilter: "ALL",
    zoneFilter: "ALL",
    categoryFilter: "ALL",
    sortBy: "SMART_PENDING_FIRST",
  });

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [lastCheckedInTicketId, setLastCheckedInTicketId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss del toast tras 5 segundos
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
      setLastCheckedInTicketId(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const eventTickets = useMemo(
    () => store.tickets.filter((t) => t.eventId === currentEvent.id),
    [store.tickets, currentEvent.id]
  );

  const eventSpecialGuests = useMemo(
    () => store.specialGuests.filter((g) => g.eventId === currentEvent.id),
    [store.specialGuests, currentEvent.id]
  );

  const allAttendees = useMemo(
    () => buildAttendeeList(eventTickets, eventSpecialGuests),
    [eventTickets, eventSpecialGuests]
  );

  const metrics = useMemo(
    () => computeAttendeeMetrics(allAttendees, currentEvent.totalCapacity),
    [allAttendees, currentEvent.totalCapacity]
  );

  const filteredAttendees = useMemo(
    () => filterAndSortAttendees(allAttendees, filters),
    [allAttendees, filters]
  );

  const handleCheckIn = (item: AttendeeItem) => {
    if (item.ticketId) {
      const res = store.checkInTicket(item.ticketId);
      if (res.success) {
        setLastCheckedInTicketId(item.ticketId);
        setToastMessage(`Ingreso acreditado: ${item.name} (${item.seatLabel || "General"})`);
      }
    }
  };

  const handleUndo = (item: AttendeeItem) => {
    if (item.ticketId) {
      store.undoCheckInTicket(item.ticketId);
      setToastMessage(null);
      setLastCheckedInTicketId(null);
    }
  };

  const handleRedeemGuest = (guestId: string, count: number) => {
    store.redeemSpecialGuest(guestId, count);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Métricas Comprimida */}
      <AttendeeMetricsBar metrics={metrics} totalCapacity={currentEvent.totalCapacity} />

      {/* Barra de Búsqueda y Filtros */}
      <AttendeeFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        onOpenQuickAddModal={() => setQuickAddOpen(true)}
        totalFilteredCount={filteredAttendees.length}
      />

      {/* Lista Dinámica de Asistentes */}
      <div className="space-y-2">
        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No se encontraron asistentes con los filtros actuales
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pruebe cambiando la búsqueda o registre al asistente in-situ.
            </p>
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: "" })}
                className="mt-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Limpiar Búsqueda
              </button>
            )}
          </div>
        ) : (
          filteredAttendees.map((item) => (
            <AttendeeCard
              key={`${item.type}-${item.id}`}
              item={item}
              onCheckIn={handleCheckIn}
              onUndo={handleUndo}
              onRedeemGuest={handleRedeemGuest}
            />
          ))
        )}
      </div>

      {/* Toast Flotante con Botón Deshacer (5 seg) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-blue-950 text-white rounded-2xl shadow-xl border border-slate-700 dark:border-blue-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          {lastCheckedInTicketId && (
            <button
              onClick={() => {
                store.undoCheckInTicket(lastCheckedInTicketId);
                setToastMessage(null);
                setLastCheckedInTicketId(null);
              }}
              className="flex items-center gap-1 px-2 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              <span>Deshacer</span>
            </button>
          )}
        </div>
      )}

      {/* Modal de Registro In-situ */}
      <QuickAddAttendeeModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        eventId={currentEvent.id}
        onAttendeeAdded={(name, seat) => {
          setToastMessage(`Acreditado in-situ: ${name} (${seat})`);
        }}
      />
    </div>
  );
};
