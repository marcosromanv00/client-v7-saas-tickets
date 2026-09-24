import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "tm_civic_theme";

let currentTheme: ThemeMode = "light";

// Inicializar tema desde localStorage (por defecto "light")
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      currentTheme = saved;
    } else {
      currentTheme = "light";
    }
  } catch {
    currentTheme = "light";
  }
  applyThemeToDom(currentTheme);
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }
}

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const themeStore = {
  getTheme(): ThemeMode {
    return currentTheme;
  },

  setTheme(theme: ThemeMode) {
    if (currentTheme === theme) return;
    currentTheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    applyThemeToDom(theme);
    emitChange();
  },

  toggleTheme() {
    this.setTheme(currentTheme === "light" ? "dark" : "light");
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useTheme(): {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
} {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getTheme,
    () => "light" as ThemeMode
  );

  return {
    theme,
    toggleTheme: () => themeStore.toggleTheme(),
    setTheme: (t: ThemeMode) => themeStore.setTheme(t),
    isDark: theme === "dark",
  };
}
