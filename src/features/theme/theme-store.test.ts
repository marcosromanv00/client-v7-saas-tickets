import { describe, it, expect, beforeEach } from "vitest";
import { themeStore } from "./theme-store";

describe("themeStore", () => {
  beforeEach(() => {
    themeStore.setTheme("light");
  });

  it("should default to light mode", () => {
    expect(themeStore.getTheme()).toBe("light");
  });

  it("should toggle from light to dark and back", () => {
    expect(themeStore.getTheme()).toBe("light");
    themeStore.toggleTheme();
    expect(themeStore.getTheme()).toBe("dark");
    themeStore.toggleTheme();
    expect(themeStore.getTheme()).toBe("light");
  });

  it("should apply classes to documentElement", () => {
    themeStore.setTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    themeStore.setTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
