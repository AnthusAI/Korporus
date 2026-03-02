export const APPEARANCE_SCHEMA_VERSION = 1 as const;

export const APPEARANCE_STORAGE_KEY = "korporus.appearance.v1";

export const APPEARANCE_CHANGED_EVENT = "korporus:system-settings:appearance-changed";

export const LEGACY_APPEARANCE_CHANGED_EVENT = "korporus:appearance-change";

export const APPEARANCE_THEME_CLASSES = [
  "theme-neutral",
  "theme-cool",
  "theme-warm",
] as const;
