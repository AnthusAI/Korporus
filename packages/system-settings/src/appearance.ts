import {
  APPEARANCE_CHANGED_EVENT,
  APPEARANCE_SCHEMA_VERSION,
  APPEARANCE_STORAGE_KEY,
  APPEARANCE_THEME_CLASSES,
  LEGACY_APPEARANCE_CHANGED_EVENT,
} from "./constants.js";
import type {
  AppearanceListener,
  AppearanceMode,
  AppearanceSettingsV1,
  AppearanceUpdater,
  KorporusSystemSettingsApi,
} from "./types.js";

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettingsV1 = {
  schemaVersion: APPEARANCE_SCHEMA_VERSION,
  mode: "system",
  theme: "neutral",
  motion: "full",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeAppearance(raw: unknown): AppearanceSettingsV1 {
  if (!isObject(raw)) return DEFAULT_APPEARANCE_SETTINGS;

  const mode =
    raw.mode === "light" || raw.mode === "dark" || raw.mode === "system"
      ? raw.mode
      : DEFAULT_APPEARANCE_SETTINGS.mode;
  const theme =
    raw.theme === "neutral" || raw.theme === "cool" || raw.theme === "warm"
      ? raw.theme
      : DEFAULT_APPEARANCE_SETTINGS.theme;
  const motion =
    raw.motion === "full" || raw.motion === "reduced" || raw.motion === "off"
      ? raw.motion
      : DEFAULT_APPEARANCE_SETTINGS.motion;

  return {
    schemaVersion: APPEARANCE_SCHEMA_VERSION,
    mode,
    theme,
    motion,
  };
}

function resolveStorage(storage?: Storage): Storage | undefined {
  if (storage) return storage;
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

function resolveWindow(win?: Window): Window | undefined {
  if (win) return win;
  if (typeof window === "undefined") return undefined;
  return window;
}

export function readStoredAppearance(storage?: Storage): AppearanceSettingsV1 {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) return DEFAULT_APPEARANCE_SETTINGS;

  const raw = targetStorage.getItem(APPEARANCE_STORAGE_KEY);
  if (!raw) return DEFAULT_APPEARANCE_SETTINGS;

  try {
    return normalizeAppearance(JSON.parse(raw));
  } catch {
    return DEFAULT_APPEARANCE_SETTINGS;
  }
}

export function writeStoredAppearance(
  next: AppearanceSettingsV1,
  storage?: Storage,
): AppearanceSettingsV1 {
  const normalized = normalizeAppearance(next);
  resolveStorage(storage)?.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function resolveEffectiveMode(
  mode: AppearanceMode,
  prefersDark?: boolean,
): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof prefersDark === "boolean") return prefersDark ? "dark" : "light";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyAppearanceToDocument(
  appearance: AppearanceSettingsV1,
  root?: HTMLElement,
  prefersDark?: boolean,
): void {
  if (typeof document === "undefined") return;
  const targetRoot = root ?? document.documentElement;
  const normalized = normalizeAppearance(appearance);
  const effectiveMode = resolveEffectiveMode(normalized.mode, prefersDark);

  targetRoot.classList.remove("light", "dark");
  targetRoot.classList.add(effectiveMode);

  targetRoot.classList.remove(...APPEARANCE_THEME_CLASSES);
  targetRoot.classList.add(`theme-${normalized.theme}`);
  targetRoot.dataset.motion = normalized.motion;
}

export function emitAppearanceChanged(
  appearance: AppearanceSettingsV1,
  win?: Window,
): void {
  const targetWindow = resolveWindow(win);
  if (!targetWindow) return;
  const normalized = normalizeAppearance(appearance);

  targetWindow.dispatchEvent(
    new CustomEvent(APPEARANCE_CHANGED_EVENT, {
      detail: { appearance: normalized },
    }),
  );
  targetWindow.dispatchEvent(new Event(LEGACY_APPEARANCE_CHANGED_EVENT));
}

export function getWindowSystemSettingsApi(
  win?: Window,
): KorporusSystemSettingsApi | undefined {
  const targetWindow = resolveWindow(win);
  return targetWindow?.korporus?.systemSettings;
}

export function installWindowSystemSettingsApi(
  api: KorporusSystemSettingsApi,
  win?: Window,
): void {
  const targetWindow = resolveWindow(win);
  if (!targetWindow) return;
  targetWindow.korporus ??= {};
  targetWindow.korporus.systemSettings = api;
}

export function readAppearance(win?: Window): AppearanceSettingsV1 {
  const targetWindow = resolveWindow(win);
  const api = getWindowSystemSettingsApi(targetWindow);
  if (api) return normalizeAppearance(api.getAppearance());
  return readStoredAppearance(targetWindow?.localStorage);
}

export function setAppearance(
  next: AppearanceUpdater,
  win?: Window,
): AppearanceSettingsV1 {
  const targetWindow = resolveWindow(win);
  const api = getWindowSystemSettingsApi(targetWindow);
  if (api) return normalizeAppearance(api.setAppearance(next));

  const previous = readStoredAppearance(targetWindow?.localStorage);
  const resolved = normalizeAppearance(typeof next === "function" ? next(previous) : next);

  writeStoredAppearance(resolved, targetWindow?.localStorage);
  applyAppearanceToDocument(resolved, targetWindow?.document?.documentElement);
  emitAppearanceChanged(resolved, targetWindow);

  return resolved;
}

export function subscribeAppearance(
  listener: AppearanceListener,
  win?: Window,
): () => void {
  const targetWindow = resolveWindow(win);
  const api = getWindowSystemSettingsApi(targetWindow);
  if (api) return api.subscribeAppearance(listener);
  if (!targetWindow) return () => undefined;

  const notifyCurrent = () => listener(readStoredAppearance(targetWindow.localStorage));

  const onCanonical = (event: Event) => {
    const customEvent = event as CustomEvent<{ appearance?: AppearanceSettingsV1 }>;
    const detailAppearance = customEvent.detail?.appearance;
    listener(detailAppearance ? normalizeAppearance(detailAppearance) : readStoredAppearance());
  };

  const onLegacy = () => notifyCurrent();

  const onStorage = (event: StorageEvent) => {
    if (event.key === APPEARANCE_STORAGE_KEY) {
      notifyCurrent();
    }
  };

  const onSystemColorChange = () => {
    const current = readStoredAppearance(targetWindow.localStorage);
    if (current.mode !== "system") return;
    applyAppearanceToDocument(current, targetWindow.document.documentElement);
    listener(current);
  };

  const colorQuery = targetWindow.matchMedia?.("(prefers-color-scheme: dark)");

  targetWindow.addEventListener(APPEARANCE_CHANGED_EVENT, onCanonical as EventListener);
  targetWindow.addEventListener(LEGACY_APPEARANCE_CHANGED_EVENT, onLegacy);
  targetWindow.addEventListener("storage", onStorage);
  colorQuery?.addEventListener("change", onSystemColorChange);

  return () => {
    targetWindow.removeEventListener(APPEARANCE_CHANGED_EVENT, onCanonical as EventListener);
    targetWindow.removeEventListener(LEGACY_APPEARANCE_CHANGED_EVENT, onLegacy);
    targetWindow.removeEventListener("storage", onStorage);
    colorQuery?.removeEventListener("change", onSystemColorChange);
  };
}
