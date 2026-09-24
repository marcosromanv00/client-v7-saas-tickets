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
  batchBookGroup: typeof theaterStore.batchBookGroup;
  checkInTicket: typeof theaterStore.checkInTicket;
  undoCheckInTicket: typeof theaterStore.undoCheckInTicket;
  redeemSpecialGuest: typeof theaterStore.redeemSpecialGuest;
  toggleTicketSeated: typeof theaterStore.toggleTicketSeated;
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
    batchBookGroup: theaterStore.batchBookGroup,
    checkInTicket: theaterStore.checkInTicket,
    undoCheckInTicket: theaterStore.undoCheckInTicket,
    redeemSpecialGuest: theaterStore.redeemSpecialGuest,
    toggleTicketSeated: theaterStore.toggleTicketSeated,
    checkInByCode: theaterStore.checkInByCode,
    checkInByQr: theaterStore.checkInByQr,
    addSpecialGuest: theaterStore.addSpecialGuest,
    resetStore: theaterStore.resetStore,
  };
}
