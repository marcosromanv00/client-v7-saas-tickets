import { useSyncExternalStore } from "react";
import { theaterStore, TheaterState } from "./ticket-store";

export interface TheaterStoreHook extends TheaterState {
  toggleRegistration: (eventId: string, enabled: boolean) => void;
  updateEvent: typeof theaterStore.updateEvent;
  updateEventSeats: typeof theaterStore.updateEventSeats;
  bookTicket: typeof theaterStore.bookTicket;
  checkInTicket: typeof theaterStore.checkInTicket;
  checkInByQr: typeof theaterStore.checkInByQr;
  addSpecialGuest: typeof theaterStore.addSpecialGuest;
  resetStore: typeof theaterStore.resetStore;
}

export function useTheaterStore(): TheaterStoreHook {
  const state = useSyncExternalStore(
    theaterStore.subscribe,
    theaterStore.getSnapshot,
    theaterStore.getSnapshot
  );

  return {
    ...state,
    toggleRegistration: theaterStore.toggleRegistration,
    updateEvent: theaterStore.updateEvent,
    updateEventSeats: theaterStore.updateEventSeats,
    bookTicket: theaterStore.bookTicket,
    checkInTicket: theaterStore.checkInTicket,
    checkInByQr: theaterStore.checkInByQr,
    addSpecialGuest: theaterStore.addSpecialGuest,
    resetStore: theaterStore.resetStore,
  };
}
