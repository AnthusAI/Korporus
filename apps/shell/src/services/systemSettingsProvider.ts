import {
  APPEARANCE_STORAGE_KEY,
  applyAppearanceToDocument,
  emitAppearanceChanged,
  getWindowSystemSettingsApi,
  installWindowSystemSettingsApi,
  normalizeAppearance,
  readStoredAppearance,
  writeStoredAppearance,
  type AppearanceListener,
  type AppearanceSettingsV1,
  type AppearanceUpdater,
  type KorporusSystemSettingsApi,
} from "@korporus/system-settings";

let initialized = false;

export function ensureSystemSettingsProvider(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const win = window;
  const previousApi = getWindowSystemSettingsApi(win);
  let appearance = readStoredAppearance(win.localStorage);
  const listeners = new Set<AppearanceListener>();

  const notify = (next: AppearanceSettingsV1) => {
    for (const listener of listeners) {
      listener(next);
    }
  };

  const setAppearanceState = (nextInput: AppearanceUpdater): AppearanceSettingsV1 => {
    const next = normalizeAppearance(
      typeof nextInput === "function" ? nextInput(appearance) : nextInput,
    );
    appearance = next;

    writeStoredAppearance(next, win.localStorage);
    applyAppearanceToDocument(next, win.document.documentElement);
    emitAppearanceChanged(next, win);
    notify(next);

    return next;
  };

  const api: KorporusSystemSettingsApi = {
    getAppearance: () => appearance,
    setAppearance: setAppearanceState,
    subscribeAppearance: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  installWindowSystemSettingsApi(api, win);
  appearance = normalizeAppearance(appearance);
  writeStoredAppearance(appearance, win.localStorage);
  applyAppearanceToDocument(appearance, win.document.documentElement);

  const colorQuery = win.matchMedia("(prefers-color-scheme: dark)");

  const onColorChange = () => {
    if (appearance.mode !== "system") return;
    applyAppearanceToDocument(appearance, win.document.documentElement);
    emitAppearanceChanged(appearance, win);
    notify(appearance);
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== APPEARANCE_STORAGE_KEY) return;
    const next = readStoredAppearance(win.localStorage);
    appearance = next;
    applyAppearanceToDocument(next, win.document.documentElement);
    emitAppearanceChanged(next, win);
    notify(next);
  };

  colorQuery.addEventListener("change", onColorChange);
  win.addEventListener("storage", onStorage);

  // HMR safety: tear down listeners and restore prior API before re-initializing.
  const hot = (import.meta as ImportMeta & { hot?: { dispose: (cb: () => void) => void } }).hot;
  if (hot) {
    hot.dispose(() => {
      colorQuery.removeEventListener("change", onColorChange);
      win.removeEventListener("storage", onStorage);

      if (previousApi) {
        installWindowSystemSettingsApi(previousApi, win);
      } else if (win.korporus) {
        delete win.korporus.systemSettings;
        if (Object.keys(win.korporus).length === 0) {
          delete win.korporus;
        }
      }
      initialized = false;
    });
  }
}
