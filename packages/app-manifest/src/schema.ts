export const SLOT_NAMES = ["titlebar", "main", "settings"] as const;

export type SlotName = (typeof SLOT_NAMES)[number];

export interface AppManifest {
  id: string;
  name: string;
  icon: string;
  version: string;
  remoteEntry: string;
  slots: Partial<Record<SlotName, string>>;
}

/** Raw JSON schema for AppManifest — usable with any JSON Schema validator. */
export const APP_MANIFEST_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "AppManifest",
  type: "object",
  required: ["id", "name", "icon", "version", "remoteEntry", "slots"],
  additionalProperties: false,
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    icon: { type: "string", minLength: 1 },
    version: {
      type: "string",
      pattern: "^\\d+\\.\\d+\\.\\d+",
    },
    remoteEntry: { type: "string", format: "uri" },
    slots: {
      type: "object",
      additionalProperties: false,
      minProperties: 1,
      properties: {
        titlebar: { type: "string", minLength: 1 },
        main: { type: "string", minLength: 1 },
        settings: { type: "string", minLength: 1 },
      },
    },
  },
} as const;
