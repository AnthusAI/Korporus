export type AppearanceMode = "light" | "dark" | "system";
export type AppearanceTheme = "neutral" | "cool" | "warm";
export type AppearanceMotion = "full" | "reduced" | "off";

export interface AppearanceState {
  mode: AppearanceMode;
  theme: AppearanceTheme;
  motion: AppearanceMotion;
}

export const STORAGE_KEY = "korporus.appearance.v1";

const DEFAULT_APPEARANCE: AppearanceState = {
  mode: "system",
  theme: "neutral",
  motion: "full",
};

function resolveSystemMode(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readAppearance(): AppearanceState {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const parsed = JSON.parse(raw) as Partial<AppearanceState>;
    return {
      mode:
        parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system"
          ? parsed.mode
          : DEFAULT_APPEARANCE.mode,
      theme:
        parsed.theme === "neutral" || parsed.theme === "cool" || parsed.theme === "warm"
          ? parsed.theme
          : DEFAULT_APPEARANCE.theme,
      motion:
        parsed.motion === "full" || parsed.motion === "reduced" || parsed.motion === "off"
          ? parsed.motion
          : DEFAULT_APPEARANCE.motion,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function applyAppearance(state: AppearanceState): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (state.mode === "system") {
    root.classList.add(resolveSystemMode());
  } else {
    root.classList.add(state.mode);
  }

  root.classList.remove("theme-neutral", "theme-cool", "theme-warm");
  root.classList.add(`theme-${state.theme}`);
  root.dataset.motion = state.motion;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("korporus:appearance-change"));
}
