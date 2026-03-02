import { parseManifest, type AppManifest } from "@korporus/app-manifest";
import { MANIFEST_URLS } from "../config/apps.js";

/**
 * Fetches all manifests listed in MANIFEST_URLS, validates each one,
 * and returns the valid set. Invalid manifests are skipped with a warning.
 */
export async function loadManifests(): Promise<AppManifest[]> {
  const results = await Promise.allSettled(
    MANIFEST_URLS.map((url) => fetchManifest(url)),
  );

  const manifests: AppManifest[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value !== null) {
      manifests.push(result.value);
    }
  }
  return manifests;
}

async function fetchManifest(url: string): Promise<AppManifest | null> {
  let raw: unknown;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[Korporus] Failed to fetch manifest at ${url}: HTTP ${res.status}`);
      return null;
    }
    raw = await res.json();
  } catch (err) {
    console.warn(`[Korporus] Error fetching manifest at ${url}:`, err);
    return null;
  }

  try {
    return parseManifest(raw);
  } catch (err) {
    console.warn(`[Korporus] Invalid manifest at ${url}:`, err);
    return null;
  }
}
