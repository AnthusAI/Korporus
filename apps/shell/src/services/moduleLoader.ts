import { init, loadRemote, registerRemotes } from "@module-federation/runtime";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  initialized = true;
  init({
    name: "shell",
    remotes: [],
    shared: {},
  });
}

/** Loaded remote IDs so we only register each remote once. */
const loadedRemotes = new Set<string>();
const registeredRemotes = new Set<string>();
const inFlightLoads = new Map<string, Promise<void>>();

/**
 * Loads a federated app's bootstrap module.
 *
 * On first call for a given remoteId:
 *   1. Registers the remote entry with the MF runtime.
 *   2. Imports the exposed `./bootstrap` module (registers Web Components as a side effect).
 *
 * Subsequent calls for the same remoteId are no-ops (Web Components are already registered).
 */
/** Resolve a potentially relative remoteEntry URL to an absolute URL. */
function resolveEntry(remoteEntry: string): string {
  if (remoteEntry.startsWith("http://") || remoteEntry.startsWith("https://")) {
    return remoteEntry;
  }
  // Relative URL → resolved against current origin (works in both container and dev)
  return `${window.location.origin}${remoteEntry}`;
}

export async function loadAppModule(remoteId: string, remoteEntry: string): Promise<void> {
  ensureInit();

  if (loadedRemotes.has(remoteId)) return;

  const existingLoad = inFlightLoads.get(remoteId);
  if (existingLoad) return existingLoad;

  const loadPromise = (async () => {
    if (!registeredRemotes.has(remoteId)) {
      registerRemotes(
        [{ name: remoteId, entry: resolveEntry(remoteEntry) }],
        { force: true },
      );
      registeredRemotes.add(remoteId);
    }

    await loadRemote(`${remoteId}/bootstrap`);
    loadedRemotes.add(remoteId);
  })();

  inFlightLoads.set(remoteId, loadPromise);

  try {
    await loadPromise;
  } catch (error) {
    registeredRemotes.delete(remoteId);
    throw error;
  } finally {
    inFlightLoads.delete(remoteId);
  }
}

/** Convert an app id to a valid MF remote name (replaces hyphens with underscores). */
export function toRemoteId(appId: string): string {
  return appId.replace(/-/g, "_");
}
