import { useSyncExternalStore } from "react";
import { theaterStore, TheaterState } from "./ticket-store";

export interface TheaterStoreHook extends TheaterState {
  toggleRegistration: (eventId: string, enabled: boolean) => void;
  updateEvent: typeof theaterStore.updateEvent;
  updateEventSeats: typeof theaterStore.updateEventSeats;
  setEventBraceletColor: typeof theaterStore.setEventBraceletColor;
  updateBraceletCatalog: typeof theaterStore.updateBraceletCatalog;
  checkAndReleaseUnclaimed: typeof theaterStore.checkAndReleaseUnclaimed;
  bookTicket: typeof theaterStore.bookTicket;
  checkInTicket: typeof theaterStore.checkInTicket;
  checkInByCode: typeof theaterStore.checkInByCode;
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
    setEventBraceletColor: theaterStore.setEventBraceletColor,
    updateBraceletCatalog: theaterStore.updateBraceletCatalog,
    checkAndReleaseUnclaimed: theaterStore.checkAndReleaseUnclaimed,
    bookTicket: theaterStore.bookTicket,
    checkInTicket: theaterStore.checkInTicket,
    checkInByCode: theaterStore.checkInByCode,
    checkInByQr: theaterStore.checkInByQr,
    addSpecialGuest: theaterStore.addSpecialGuest,
    resetStore: theaterStore.resetStore,
  };
}
