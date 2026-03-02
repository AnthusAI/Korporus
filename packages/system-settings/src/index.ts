export {
  APPEARANCE_CHANGED_EVENT,
  APPEARANCE_SCHEMA_VERSION,
  APPEARANCE_STORAGE_KEY,
  APPEARANCE_THEME_CLASSES,
  LEGACY_APPEARANCE_CHANGED_EVENT,
} from "./constants.js";

export type {
  AppearanceListener,
  AppearanceMode,
  AppearanceMotion,
  AppearanceSettingsV1,
  AppearanceTheme,
  AppearanceUpdater,
  KorporusSystemSettingsApi,
  KorporusWindowNamespace,
} from "./types.js";

export {
  applyAppearanceToDocument,
  DEFAULT_APPEARANCE_SETTINGS,
  emitAppearanceChanged,
  getWindowSystemSettingsApi,
  installWindowSystemSettingsApi,
  normalizeAppearance,
  readAppearance,
  readStoredAppearance,
  resolveEffectiveMode,
  setAppearance,
  subscribeAppearance,
  writeStoredAppearance,
} from "./appearance.js";
