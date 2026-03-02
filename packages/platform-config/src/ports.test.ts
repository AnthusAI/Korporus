import { describe, it, expect } from "vitest";
import {
  getDevPort,
  getDevOrigin,
  getDevRemoteOrigins,
  getPortEntry,
  getPortRegistry,
} from "./ports.js";

describe("getPortEntry", () => {
  it("returns the port entry for a known app", () => {
    const entry = getPortEntry("hello-app");
    expect(entry.dev).toBe(3001);
    expect(entry.preview).toBe(4001);
  });

  it("throws for an unknown app id", () => {
    expect(() => getPortEntry("nonexistent")).toThrow(/No port assignment/);
  });
});

describe("getDevPort", () => {
  it("returns the dev port for an app", () => {
    expect(getDevPort("shell")).toBe(3000);
    expect(getDevPort("hello-app")).toBe(3001);
    expect(getDevPort("docs-app")).toBe(3002);
  });
});

describe("getDevOrigin", () => {
  it("returns the full localhost URL", () => {
    expect(getDevOrigin("hello-app")).toBe("http://localhost:3001");
  });
});

describe("getDevRemoteOrigins", () => {
  it("excludes the shell", () => {
    const origins = getDevRemoteOrigins();
    expect(origins).not.toHaveProperty("shell");
  });

  it("includes all remote apps", () => {
    const origins = getDevRemoteOrigins();
    expect(origins["hello-app"]).toBe("http://localhost:3001");
    expect(origins["docs-app"]).toBe("http://localhost:3002");
  });
});

describe("port uniqueness", () => {
  it("has no duplicate dev ports", () => {
    const registry = getPortRegistry();
    const devPorts = Object.values(registry).map((e) => e.dev);
    expect(new Set(devPorts).size).toBe(devPorts.length);
  });

  it("has no duplicate preview ports", () => {
    const registry = getPortRegistry();
    const previewPorts = Object.values(registry).map((e) => e.preview);
    expect(new Set(previewPorts).size).toBe(previewPorts.length);
  });

  it("has no overlap between dev and preview ports", () => {
    const registry = getPortRegistry();
    const devPorts = new Set(Object.values(registry).map((e) => e.dev));
    const previewPorts = Object.values(registry).map((e) => e.preview);
    for (const p of previewPorts) {
      expect(devPorts.has(p)).toBe(false);
    }
  });
});
