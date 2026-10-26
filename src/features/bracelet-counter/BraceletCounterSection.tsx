import React, { useMemo, useState } from "react";
import { TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { calculateBraceletMetrics } from "./bracelet-counter-utils";
import { BraceletTelemetryBar } from "./BraceletTelemetryBar";
import { BraceletTactilePad } from "./BraceletTactilePad";
import { BraceletHistoryModal } from "./BraceletHistoryModal";

interface BraceletCounterSectionProps {
  currentEvent: TheaterEvent;
}

export const BraceletCounterSection: React.FC<BraceletCounterSectionProps> = ({
  currentEvent,
}) => {
  const store = useTheaterStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const counterData = store.braceletCountersByEvent?.[currentEvent.id] || {
    eventId: currentEvent.id,
    deliveredCount: 0,
    history: [],
  };

  const metrics = useMemo(() => {
    return calculateBraceletMetrics(currentEvent.totalCapacity, counterData.deliveredCount);
  }, [currentEvent.totalCapacity, counterData.deliveredCount]);

  const handleAddDelta = (delta: number, note?: string) => {
    store.updateBraceletCount(currentEvent.id, delta, note);
  };

  const handleReset = () => {
    store.resetBraceletCount(currentEvent.id);
  };

  const lastDeliveryDelta = counterData.history?.find((h) => h.delta > 0)?.delta || 1;

  return (
    <div className="space-y-2 max-w-lg mx-auto w-full min-w-0">
      {/* 1. Barra Compacta de Telemetría y Controles (Single Screen) */}
      <BraceletTelemetryBar
        currentEvent={currentEvent}
        metrics={metrics}
        historyCount={counterData.history?.length || 0}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 2. Teclado Táctil de Alta Frecuencia para Boletería */}
      <BraceletTactilePad
        metrics={metrics}
        onAddDelta={handleAddDelta}
        onReset={handleReset}
        lastDeliveryDelta={lastDeliveryDelta}
      />

      {/* 3. Modal de Auditoría de Historial bajo demanda */}
      <BraceletHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={counterData.history || []}
      />
    </div>
  );
};

