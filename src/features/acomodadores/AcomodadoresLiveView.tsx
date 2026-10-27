import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sliders, Armchair, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { useAuthStore } from "../auth/useAuthStore";
import { EventConfigModal } from "../admin/EventConfigModal";
import { TheaterSeatMapLegend } from "../seat-reservation/TheaterSeatMapLegend";
import { calculateAcomodadorRoomMetrics } from "./acomodadores-seat-handler";
import { UsherVectorSvgCanvas } from "./UsherVectorSvgCanvas";
import { UsherSectorDetailView } from "./UsherSectorDetailView";
import { UsherBatchActionBar } from "./UsherBatchActionBar";
import { UsherSectorId } from "./usher-sectors.config";
import { Seat } from "../tickets/types";
import {
  getDefaultActiveEventId,
  findActiveEventForDate,
  getUpcomingActiveEvents,
} from "../tickets/event-date-utils";

export const AcomodadoresLiveView: React.FC = () => {
  const store = useTheaterStore();
  const { isSuperAdmin, isProducer, isStaff, isAdminStaff } = useAuthStore();
  const canManage = isSuperAdmin || isProducer || isStaff || isAdminStaff;
  const upcomingEvents = getUpcomingActiveEvents(store.events, 4);
  const [selectedEventId, setSelectedEventId] = useState(() => getDefaultActiveEventId(store.events));
  const [selectedSectorId, setSelectedSectorId] = useState<UsherSectorId | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const currentEvent =
    store.events.find((e) => e.id === selectedEventId) ||
    upcomingEvents[0] ||
    findActiveEventForDate(store.events) ||
    store.events[0];

  const eventSeats = store.seatsByEvent[currentEvent.id] || [];
  const deliveredBracelets = store.braceletCountersByEvent?.[currentEvent.id]?.deliveredCount || 0;
  const metrics = calculateAcomodadorRoomMetrics(currentEvent.totalCapacity, eventSeats, deliveredBracelets);

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  const handleConfirmBatchIngreso = () => {
    if (selectedSeatIds.length === 0) return;
    store.batchSetSeatsOccupancy(currentEvent.id, selectedSeatIds, "OCCUPIED");
    toast.success(`${selectedSeatIds.length} butacas ingresadas a sala`);
    setSelectedSeatIds([]);
  };

  const handleReleaseBatchSeats = () => {
    if (selectedSeatIds.length === 0) return;
    store.batchSetSeatsOccupancy(currentEvent.id, selectedSeatIds, "AVAILABLE");
    toast.info(`${selectedSeatIds.length} butacas liberadas`);
    setSelectedSeatIds([]);
  };

  const selectedSeats = eventSeats.filter((s) => selectedSeatIds.includes(s.id));

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-2 sm:py-3 pb-36 sm:pb-40 space-y-3 text-slate-900 dark:text-slate-100 select-none overflow-x-hidden min-w-0">
      {/* 1. HUD Ribbon de Acomodador */}
      <header className="bg-white dark:bg-[#0b1a30] px-3 py-2 rounded-xl border border-slate-200 dark:border-teatro-navy-border shadow-2xs flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setSelectedSeatIds([]);
            }}
            className="w-40 sm:w-60 truncate min-w-0 px-2.5 py-1.5 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none"
          >
            {upcomingEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 24 ? `${evt.title.slice(0, 22)}...` : evt.title} ({evt.time})
              </option>
            ))}
          </select>

          <span
            className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
            style={{ backgroundColor: currentEvent.braceletColorHex || "#ffffff" }}
            title={`Brazalete Oficial: ${currentEvent.braceletColorName || "Blanco"}`}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Armchair className="w-3.5 h-3.5" />
              {metrics.availableSeats} <span className="text-3xs font-normal opacity-75 font-sans">libres</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" />
              {metrics.seatedInRoom} <span className="text-3xs font-normal opacity-75 font-sans">en sala</span>
            </span>
          </div>

          {canManage && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071324] dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1a3357] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              title="Ajustar capacidad y brazalete"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Mapa Vectorial Arquitectónico con Semantic Zoom Dinámico */}
      <section className="bg-white dark:bg-[#0b1a30] rounded-2xl border border-slate-200 dark:border-teatro-navy-border p-2.5 sm:p-4 shadow-sm relative select-none transition-all w-full min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          {!selectedSectorId ? (
            <motion.div
              key="macro-svg-canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <UsherVectorSvgCanvas
                seats={eventSeats}
                selectedSeatIds={selectedSeatIds}
                onSelectSector={(sectorId) => setSelectedSectorId(sectorId)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="detail-sector-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <UsherSectorDetailView
                sectorId={selectedSectorId}
                seats={eventSeats}
                selectedSeatIds={selectedSeatIds}
                onToggleSeat={handleToggleSeat}
                onBackToMacro={() => setSelectedSectorId(null)}
                onSelectSector={(sectorId) => setSelectedSectorId(sectorId)}
                onFillRow={(rowLetter, fill) => store.fillRowOccupancy(currentEvent.id, rowLetter, fill)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          <TheaterSeatMapLegend />
        </div>
      </section>

      {/* 3. Barra Flotante de Confirmación en 2 Toques */}
      <UsherBatchActionBar
        selectedSeats={selectedSeats}
        onConfirmIngreso={handleConfirmBatchIngreso}
        onReleaseSeats={handleReleaseBatchSeats}
        onClearSelection={() => setSelectedSeatIds([])}
      />

      {/* Modal de Configuración */}
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
