import { TheaterState } from "../tickets/ticket-store-types";
import { applyBraceletDelta, createBraceletLogItem } from "./bracelet-counter-utils";

export interface UpdateBraceletResult {
  updatedState: TheaterState;
  appliedDelta: number;
  isFull: boolean;
  count: number;
}

export function executeUpdateBraceletCount(
  state: TheaterState,
  eventId: string,
  delta: number,
  notes?: string
): UpdateBraceletResult {
  const event = state.events.find((e) => e.id === eventId);
  const maxCapacity = event ? event.totalCapacity : 220;

  const currentCounter = state.braceletCountersByEvent?.[eventId] || {
    eventId,
    deliveredCount: 0,
    history: [],
  };

  const { nextCount, appliedDelta, isFull } = applyBraceletDelta(
    currentCounter.deliveredCount,
    delta,
    maxCapacity
  );

  const logItem = createBraceletLogItem(
    eventId,
    appliedDelta,
    nextCount,
    notes || (delta > 0 ? `+${delta} brazaletes` : `${delta} corrección`)
  );

  const updatedCounter = {
    eventId,
    deliveredCount: nextCount,
    history: [logItem, ...(currentCounter.history || [])].slice(0, 50),
  };

  const updatedState: TheaterState = {
    ...state,
    braceletCountersByEvent: {
      ...state.braceletCountersByEvent,
      [eventId]: updatedCounter,
    },
  };

  return { updatedState, appliedDelta, isFull, count: nextCount };
}

export function executeResetBraceletCount(state: TheaterState, eventId: string): TheaterState {
  const logItem = createBraceletLogItem(eventId, 0, 0, "Contador reiniciado");
  return {
    ...state,
    braceletCountersByEvent: {
      ...state.braceletCountersByEvent,
      [eventId]: {
        eventId,
        deliveredCount: 0,
        history: [logItem],
      },
    },
  };
}
