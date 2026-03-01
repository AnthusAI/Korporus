/**
 * Port registry — the single source of truth for dev server ports.
 *
 * To add a new app, add one line here. Everything else derives from this.
 */

export interface PortEntry {
  /** Primary dev server port (Vite). */
  dev: number;
  /** Preview server port (vite preview). */
  preview: number;
  // Future: api?: number;
}

const PORT_REGISTRY: Record<string, PortEntry> = {
  shell: { dev: 3000, preview: 4000 },
  "hello-app": { dev: 3001, preview: 4001 },
  "docs-app": { dev: 3002, preview: 4002 },
};

/**
 * Get the port entry for an app by id.
 * Throws if the app id is not registered — fail fast during config resolution.
 */
export function getPortEntry(appId: string): PortEntry {
  const entry = PORT_REGISTRY[appId];
  if (!entry) {
    throw new Error(
      `[platform-config] No port assignment for "${appId}". ` +
        `Register it in packages/platform-config/src/ports.ts`,
    );
  }
  return entry;
}

/** Get the dev server port for an app. */
export function getDevPort(appId: string): number {
  return getPortEntry(appId).dev;
}

/** Get the dev server origin URL for an app. */
export function getDevOrigin(appId: string): string {
  return `http://localhost:${getDevPort(appId)}`;
}

/**
 * Get the complete devRemoteOrigins map for the shell's manifest rewrite plugin.
 * Returns all registered apps except the shell itself.
 */
export function getDevRemoteOrigins(): Record<string, string> {
  const origins: Record<string, string> = {};
  for (const [id, entry] of Object.entries(PORT_REGISTRY)) {
    if (id !== "shell") {
      origins[id] = `http://localhost:${entry.dev}`;
    }
  }
  return origins;
}

/** Get all registered app ids (excluding shell). */
export function getRemoteAppIds(): string[] {
  return Object.keys(PORT_REGISTRY).filter((id) => id !== "shell");
}

/** Full registry for tooling or inspection. */
export function getPortRegistry(): Readonly<Record<string, PortEntry>> {
  return PORT_REGISTRY;
}
