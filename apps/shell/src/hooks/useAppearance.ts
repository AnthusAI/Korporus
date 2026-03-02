import { useEffect } from "react";

export type AppearanceMode = "light" | "dark" | "system";
export type AppearanceTheme = "neutral" | "cool" | "warm";
export type AppearanceMotion = "full" | "reduced" | "off";

export interface AppearanceState {
  mode: AppearanceMode;
  theme: AppearanceTheme;
  motion: AppearanceMotion;
}

const STORAGE_KEY = "korporus.appearance.v1";

const DEFAULT_APPEARANCE: AppearanceState = {
  mode: "system",
  theme: "neutral",
  motion: "full",
};

function getSystemMode(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function parseStoredAppearance(raw: string | null): AppearanceState {
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const parsed = JSON.parse(raw) as Partial<AppearanceState>;
    const mode: AppearanceMode =
      parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system"
        ? parsed.mode
        : DEFAULT_APPEARANCE.mode;
    const theme: AppearanceTheme =
      parsed.theme === "neutral" || parsed.theme === "cool" || parsed.theme === "warm"
        ? parsed.theme
        : DEFAULT_APPEARANCE.theme;
    const motion: AppearanceMotion =
      parsed.motion === "full" || parsed.motion === "reduced" || parsed.motion === "off"
        ? parsed.motion
        : DEFAULT_APPEARANCE.motion;
    return { mode, theme, motion };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function readAppearance(): AppearanceState {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  return parseStoredAppearance(window.localStorage.getItem(STORAGE_KEY));
}

export function applyAppearance(state: AppearanceState): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (state.mode === "system") {
    root.classList.add(getSystemMode());
  } else {
    root.classList.add(state.mode);
  }

  root.classList.remove("theme-neutral", "theme-cool", "theme-warm");
  root.classList.add(`theme-${state.theme}`);
  root.dataset.motion = state.motion;
}

export function useAppearanceSync(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyCurrent = () => applyAppearance(readAppearance());
    applyCurrent();

    const colorQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onColorChange = () => {
      const state = readAppearance();
      if (state.mode === "system") {
        applyAppearance(state);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        applyCurrent();
      }
    };
    const onAppearanceEvent = () => applyCurrent();

    colorQuery.addEventListener("change", onColorChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("korporus:appearance-change", onAppearanceEvent as EventListener);

    return () => {
      colorQuery.removeEventListener("change", onColorChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "korporus:appearance-change",
        onAppearanceEvent as EventListener,
      );
    };
  }, []);
}

