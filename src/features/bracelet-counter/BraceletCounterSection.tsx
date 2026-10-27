import React, { useMemo } from "react";
import { TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { calculateBraceletMetrics } from "./bracelet-counter-utils";
import { BraceletRadialTelemetry } from "./BraceletRadialTelemetry";
import { BraceletTactilePad } from "./BraceletTactilePad";

interface BraceletCounterSectionProps {
  currentEvent: TheaterEvent;
}

export const BraceletCounterSection: React.FC<BraceletCounterSectionProps> = ({
  currentEvent,
}) => {
  const store = useTheaterStore();

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
    <div className="space-y-3 max-w-md mx-auto w-full min-w-0">
      {/* 2. ZONA MEDIA: Telemetría Radial de Ocupación (App Mobile) */}
      <BraceletRadialTelemetry metrics={metrics} />

      {/* 3. ZONA INFERIOR: Botonera Táctil Ergonómica con Conmutador de Acción */}
      <BraceletTactilePad
        metrics={metrics}
        onAddDelta={handleAddDelta}
        onReset={handleReset}
        lastDeliveryDelta={lastDeliveryDelta}
      />
    </div>
  );
};
