import { APP_MANIFEST_SCHEMA, SLOT_NAMES, type AppManifest, type SlotName } from "./schema.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates a raw JSON value against the AppManifest schema.
 * Returns a ValidationResult with descriptive error messages.
 *
 * This is a hand-rolled validator so the package has zero runtime dependencies.
 */
export function validateManifest(raw: unknown): ValidationResult {
  // Keep the schema import referenced so it's not tree-shaken in strict builds.
  void APP_MANIFEST_SCHEMA;

  const errors: string[] = [];

  if (!isObject(raw)) {
    return { valid: false, errors: ["Manifest must be a JSON object"] };
  }

  const required = ["id", "name", "icon", "version", "remoteEntry", "slots"] as const;
  for (const field of required) {
    if (!(field in raw)) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (errors.length > 0) return { valid: false, errors };

  if (typeof raw.id !== "string" || raw.id.trim() === "") {
    errors.push('"id" must be a non-empty string');
  }
  if (typeof raw.name !== "string" || raw.name.trim() === "") {
    errors.push('"name" must be a non-empty string');
  }
  if (typeof raw.icon !== "string" || raw.icon.trim() === "") {
    errors.push('"icon" must be a non-empty string');
  }
  if (typeof raw.version !== "string" || !/^\d+\.\d+\.\d+/.test(raw.version)) {
    errors.push('"version" must be a semver string (e.g. "1.0.0")');
  }
  if (typeof raw.remoteEntry !== "string" || raw.remoteEntry.trim() === "") {
    errors.push('"remoteEntry" must be a non-empty string URL');
  }

  if (!isObject(raw.slots)) {
    errors.push('"slots" must be an object');
  } else {
    const slots = raw.slots as Record<string, unknown>;
    const keys = Object.keys(slots);

    if (keys.length === 0) {
      errors.push('"slots" must define at least one slot');
    }

    for (const key of keys) {
      if (!(SLOT_NAMES as readonly string[]).includes(key)) {
        errors.push(
          `Unknown slot name "${key}". Allowed slots: ${SLOT_NAMES.join(", ")}`,
        );
      } else if (typeof slots[key] !== "string" || (slots[key] as string).trim() === "") {
        errors.push(`Slot "${key}" must map to a non-empty custom element tag name`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a raw value and returns it typed as AppManifest if valid.
 * Throws an Error with all validation messages if invalid.
 */
export function parseManifest(raw: unknown): AppManifest {
  const result = validateManifest(raw);
  if (!result.valid) {
    throw new Error(`Invalid app manifest:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`);
  }
  // Safe cast: all fields have been validated above.
  const m = raw as Record<string, unknown>;
  return {
    id: m.id as string,
    name: m.name as string,
    icon: m.icon as string,
    version: m.version as string,
    remoteEntry: m.remoteEntry as string,
    slots: m.slots as Partial<Record<SlotName, string>>,
  };
}
