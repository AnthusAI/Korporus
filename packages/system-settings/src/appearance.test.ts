// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  APPEARANCE_CHANGED_EVENT,
  APPEARANCE_STORAGE_KEY,
  LEGACY_APPEARANCE_CHANGED_EVENT,
} from "./constants.js";
import {
  applyAppearanceToDocument,
  DEFAULT_APPEARANCE_SETTINGS,
  installWindowSystemSettingsApi,
  normalizeAppearance,
  readStoredAppearance,
  resolveEffectiveMode,
  setAppearance,
  subscribeAppearance,
} from "./appearance.js";
import type { AppearanceSettingsV1, KorporusSystemSettingsApi } from "./types.js";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

function clearWindowApi() {
  if (window.korporus?.systemSettings) {
    delete window.korporus.systemSettings;
  }
  if (window.korporus && Object.keys(window.korporus).length === 0) {
    delete window.korporus;
  }
}

let storage: Storage;

describe("normalizeAppearance", () => {
  it("returns defaults for unknown values", () => {
    expect(normalizeAppearance({ mode: "bad", theme: "bad", motion: "bad" })).toEqual(
      DEFAULT_APPEARANCE_SETTINGS,
    );
  });

  it("keeps valid values and pins schema version", () => {
    expect(
      normalizeAppearance({
        schemaVersion: 999,
        mode: "dark",
        theme: "warm",
        motion: "off",
      }),
    ).toEqual({
      schemaVersion: 1,
      mode: "dark",
      theme: "warm",
      motion: "off",
    });
  });
});

describe("readStoredAppearance", () => {
  beforeEach(() => {
    storage = createMemoryStorage();
    Object.defineProperty(window, "localStorage", {
      value: storage,
      configurable: true,
    });
    clearWindowApi();
  });

  it("returns defaults when unset", () => {
    expect(readStoredAppearance()).toEqual(DEFAULT_APPEARANCE_SETTINGS);
  });

  it("falls back to defaults on corrupted JSON", () => {
    storage.setItem(APPEARANCE_STORAGE_KEY, "{not valid json");
    expect(readStoredAppearance()).toEqual(DEFAULT_APPEARANCE_SETTINGS);
  });

  it("normalizes partially valid stored JSON", () => {
    storage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({ mode: "light", theme: "unknown", motion: "reduced" }),
    );
    expect(readStoredAppearance()).toEqual({
      schemaVersion: 1,
      mode: "light",
      theme: "neutral",
      motion: "reduced",
    });
  });
});

describe("resolveEffectiveMode", () => {
  it("returns non-system mode as-is", () => {
    expect(resolveEffectiveMode("light", true)).toBe("light");
    expect(resolveEffectiveMode("dark", false)).toBe("dark");
  });

  it("resolves system mode from explicit prefersDark input", () => {
    expect(resolveEffectiveMode("system", true)).toBe("dark");
    expect(resolveEffectiveMode("system", false)).toBe("light");
  });
});

describe("applyAppearanceToDocument", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    delete document.documentElement.dataset.motion;
  });

  it("applies mode/theme/motion classes and dataset", () => {
    applyAppearanceToDocument({
      schemaVersion: 1,
      mode: "dark",
      theme: "cool",
      motion: "off",
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("theme-cool")).toBe(true);
    expect(document.documentElement.dataset.motion).toBe("off");
  });
});

describe("subscribeAppearance fallback behavior", () => {
  beforeEach(() => {
    storage = createMemoryStorage();
    Object.defineProperty(window, "localStorage", {
      value: storage,
      configurable: true,
    });
    clearWindowApi();
  });

  it("notifies on canonical changed event", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAppearance(listener);

    const next: AppearanceSettingsV1 = {
      schemaVersion: 1,
      mode: "dark",
      theme: "warm",
      motion: "full",
    };

    window.dispatchEvent(
      new CustomEvent(APPEARANCE_CHANGED_EVENT, { detail: { appearance: next } }),
    );

    expect(listener).toHaveBeenCalledWith(next);
    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAppearance(listener);
    unsubscribe();

    window.dispatchEvent(new Event(LEGACY_APPEARANCE_CHANGED_EVENT));
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("setAppearance prefers shell API when available", () => {
  beforeEach(() => {
    storage = createMemoryStorage();
    Object.defineProperty(window, "localStorage", {
      value: storage,
      configurable: true,
    });
    clearWindowApi();
  });

  it("delegates updates to installed window API", () => {
    const subscribeAppearance = () => () => undefined;
    const api: KorporusSystemSettingsApi = {
      getAppearance: () => DEFAULT_APPEARANCE_SETTINGS,
      setAppearance: () => ({
        schemaVersion: 1,
        mode: "dark",
        theme: "cool",
        motion: "reduced",
      }),
      subscribeAppearance,
    };

    installWindowSystemSettingsApi(api);
    const next = setAppearance({
      schemaVersion: 1,
      mode: "light",
      theme: "neutral",
      motion: "full",
    });

    expect(next.mode).toBe("dark");
    expect(storage.getItem(APPEARANCE_STORAGE_KEY)).toBeNull();
  });
});
