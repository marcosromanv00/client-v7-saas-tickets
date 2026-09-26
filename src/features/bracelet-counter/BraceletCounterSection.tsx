import React, { useMemo } from "react";
import { TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { calculateBraceletMetrics } from "./bracelet-counter-utils";
import { BraceletHeaderBanner } from "./BraceletHeaderBanner";
import { BraceletMetricsCard } from "./BraceletMetricsCard";
import { BraceletTactilePad } from "./BraceletTactilePad";
import { BraceletHistoryDrawer } from "./BraceletHistoryDrawer";

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

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 1. Cabecera Informativa con Color Oficial del Brazalete */}
      <BraceletHeaderBanner currentEvent={currentEvent} metrics={metrics} />

      {/* 2. Medidor Visual de Aforo e Impacto en Vivo */}
      <BraceletMetricsCard metrics={metrics} />

      {/* 3. Clicker Táctil Principal para Contabilizar Entradas */}
      <BraceletTactilePad
        metrics={metrics}
        onAddDelta={handleAddDelta}
        onReset={handleReset}
      />

      {/* 4. Historial Desplegable de Entregas Realizadas */}
      <BraceletHistoryDrawer history={counterData.history} />
    </div>
  );
};
