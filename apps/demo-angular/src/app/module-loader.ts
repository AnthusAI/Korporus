import { init, loadRemote, registerRemotes } from '@module-federation/runtime';

let initialized = false;
const loadedRemotes = new Set<string>();

export async function loadAppModule(remoteId: string, remoteEntry: string): Promise<void> {
  if (!initialized) {
    initialized = true;
    init({ name: 'demo_angular', remotes: [], shared: {} });
  }
  if (loadedRemotes.has(remoteId)) return;
  registerRemotes([{ name: remoteId, entry: remoteEntry }], { force: true });
  await loadRemote(`${remoteId}/bootstrap`);
  loadedRemotes.add(remoteId);
}
