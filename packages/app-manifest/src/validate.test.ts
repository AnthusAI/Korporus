import { describe, it, expect } from "vitest";
import { validateManifest, parseManifest } from "./validate.js";
import type { AppManifest } from "./schema.js";

const VALID: AppManifest = {
  id: "hello-app",
  name: "Hello World",
  icon: "./icon.svg",
  version: "1.0.0",
  remoteEntry: "http://localhost:3001/remoteEntry.js",
  slots: {
    titlebar: "hello-app-titlebar",
    main: "hello-app-main",
    settings: "hello-app-settings",
  },
};

describe("validateManifest", () => {
  it("passes for a complete valid manifest", () => {
    const result = validateManifest(VALID);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passes when only some slots are defined", () => {
    const result = validateManifest({ ...VALID, slots: { main: "hello-app-main" } });
    expect(result.valid).toBe(true);
  });

  it("fails when the manifest is not an object", () => {
    expect(validateManifest(null).valid).toBe(false);
    expect(validateManifest("string").valid).toBe(false);
    expect(validateManifest(42).valid).toBe(false);
  });

  it("reports all missing required fields", () => {
    const result = validateManifest({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: "id"');
    expect(result.errors).toContain('Missing required field: "remoteEntry"');
    expect(result.errors).toContain('Missing required field: "slots"');
  });

  it("fails when id is empty", () => {
    const result = validateManifest({ ...VALID, id: "  " });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"id"'))).toBe(true);
  });

  it("fails when version is not semver", () => {
    const result = validateManifest({ ...VALID, version: "not-a-version" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"version"'))).toBe(true);
  });

  it("fails when remoteEntry is empty", () => {
    const result = validateManifest({ ...VALID, remoteEntry: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"remoteEntry"'))).toBe(true);
  });

  it("fails when slots is not an object", () => {
    const result = validateManifest({ ...VALID, slots: "bad" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"slots"'))).toBe(true);
  });

  it("fails when slots is empty", () => {
    const result = validateManifest({ ...VALID, slots: {} });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("at least one slot"))).toBe(true);
  });

  it("fails and names the unknown slot", () => {
    const result = validateManifest({ ...VALID, slots: { sidebar: "foo" } });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"sidebar"'))).toBe(true);
    expect(result.errors.some((e) => e.includes("titlebar, main, settings"))).toBe(true);
  });

  it("fails when a slot value is an empty string", () => {
    const result = validateManifest({ ...VALID, slots: { main: "" } });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"main"'))).toBe(true);
  });
});

describe("parseManifest", () => {
  it("returns a typed AppManifest for a valid input", () => {
    const manifest = parseManifest(VALID);
    expect(manifest.id).toBe("hello-app");
    expect(manifest.slots.main).toBe("hello-app-main");
  });

  it("throws with descriptive messages for an invalid manifest", () => {
    expect(() => parseManifest({ id: "x", name: "X", icon: "i", version: "bad" })).toThrow(
      /Invalid app manifest/,
    );
  });
});
