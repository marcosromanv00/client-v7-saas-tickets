let storageTimer: ReturnType<typeof setTimeout> | null = null;
let pendingState: unknown = null;
let currentKey = "";

export function scheduleStorageSave(key: string, state: unknown, delayMs: number = 250): void {
  if (typeof localStorage === "undefined") return;
  currentKey = key;
  pendingState = state;
  if (storageTimer) clearTimeout(storageTimer);
  storageTimer = setTimeout(() => {
    try {
      localStorage.setItem(currentKey, JSON.stringify(pendingState));
    } catch (e) {
      console.warn("[Storage Debouncer] Error saving state:", e);
    }
    storageTimer = null;
  }, delayMs);
}

export function flushStorageSaveSync(key?: string, state?: unknown): void {
  if (typeof localStorage === "undefined") return;
  if (storageTimer) {
    clearTimeout(storageTimer);
    storageTimer = null;
  }
  const targetKey = key || currentKey;
  const targetState = state !== undefined ? state : pendingState;
  if (!targetKey || targetState === null || targetState === undefined) return;
  try {
    localStorage.setItem(targetKey, JSON.stringify(targetState));
  } catch (e) {
    console.warn("[Storage Debouncer] Error flushing state:", e);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => flushStorageSaveSync());
}
