import type { APPEARANCE_SCHEMA_VERSION } from "./constants.js";

export type AppearanceMode = "light" | "dark" | "system";
export type AppearanceTheme = "neutral" | "cool" | "warm";
export type AppearanceMotion = "full" | "reduced" | "off";

export interface AppearanceSettingsV1 {
  schemaVersion: typeof APPEARANCE_SCHEMA_VERSION;
  mode: AppearanceMode;
  theme: AppearanceTheme;
  motion: AppearanceMotion;
}

export type AppearanceUpdater =
  | AppearanceSettingsV1
  | ((previous: AppearanceSettingsV1) => AppearanceSettingsV1);

export type AppearanceListener = (next: AppearanceSettingsV1) => void;

export interface KorporusSystemSettingsApi {
  getAppearance: () => AppearanceSettingsV1;
  setAppearance: (next: AppearanceUpdater) => AppearanceSettingsV1;
  subscribeAppearance: (listener: AppearanceListener) => () => void;
}

export interface KorporusWindowNamespace {
  systemSettings?: KorporusSystemSettingsApi;
}

declare global {
  interface Window {
    korporus?: KorporusWindowNamespace;
  }
}
