export type TheaterSyncEventType =
  | "TICKET_BOOKED"
  | "TICKET_CHECKED_IN"
  | "TICKET_SEATED"
  | "UNCLAIMED_RELEASED"
  | "STATE_RESET";

export interface TheaterSyncMessage {
  type: TheaterSyncEventType;
  timestamp: number;
  payload?: Record<string, unknown>;
}

type SyncListener = (message: TheaterSyncMessage) => void;

class TheaterSyncChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("tm_theater_sync");
        this.channel.onmessage = (event: MessageEvent<TheaterSyncMessage>) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn("BroadcastChannel initialization skipped", err);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (event.key === "tm_theater_civic_store_v1") {
          this.notifyListeners({
            type: "TICKET_CHECKED_IN",
            timestamp: Date.now(),
          });
        }
      });
    }
  }

  public broadcast(type: TheaterSyncEventType, payload?: Record<string, unknown>): void {
    const msg: TheaterSyncMessage = {
      type,
      timestamp: Date.now(),
      payload,
    };
    try {
      this.channel?.postMessage(msg);
    } catch (err) {
      console.warn("Broadcast postMessage error", err);
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(message: TheaterSyncMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error("Sync listener error", err);
      }
    });
  }
}

export const theaterSync = new TheaterSyncChannel();
