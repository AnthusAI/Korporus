import { create } from "zustand";
import type { AppManifest } from "@korporus/app-manifest";

interface RegistryState {
  apps: AppManifest[];
  loaded: boolean;
  setApps: (apps: AppManifest[]) => void;
}

export const useRegistry = create<RegistryState>((set) => ({
  apps: [],
  loaded: false,
  setApps: (apps) => set({ apps, loaded: true }),
}));

/** Look up a manifest by id. Returns undefined if not found. */
export function useAppManifest(id: string): AppManifest | undefined {
  return useRegistry((s) => s.apps.find((a) => a.id === id));
}
