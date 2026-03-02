import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import ShellChrome from "../components/ShellChrome";
import { useRegistry } from "../store/registry.js";
import { loadAppModule, toRemoteId } from "../services/moduleLoader.js";
import {
  SETTINGS_CANCEL_EVENT,
  SETTINGS_SAVE_EVENT,
  SETTINGS_STATE_EVENT,
  type SettingsSessionState,
} from "@korporus/app-shell-ui";

type LoadState = "idle" | "loading" | "loaded" | "error";

function SlotContainer({
  tagName,
  className,
  onElementChange,
}: {
  tagName: string | undefined;
  className?: string;
  onElementChange?: (element: HTMLElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tagName || !ref.current) {
      onElementChange?.(null);
      return;
    }
    const el = document.createElement(tagName);
    ref.current.innerHTML = "";
    ref.current.appendChild(el);
    onElementChange?.(el);
    return () => {
      if (ref.current) ref.current.innerHTML = "";
      onElementChange?.(null);
    };
  }, [tagName, onElementChange]);

  return <div ref={ref} className={className} />;
}

export default function AppView() {
  const { appId, view } = useParams<{ appId: string; view?: string }>();
  const navigate = useNavigate();
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settingsHost, setSettingsHost] = useState<HTMLElement | null>(null);
  const [settingsSession, setSettingsSession] = useState<SettingsSessionState>({
    dirty: false,
    valid: true,
    saving: false,
  });
  const settingsView = view === "settings";

  const appKey = appId ?? "";
  const manifestsLoaded = useRegistry((s) => s.loaded);
  const manifest = useRegistry((s) => s.apps.find((a) => a.id === appKey));

  useEffect(() => {
    if (!manifest) return;
    setLoadState("loading");
    const remoteId = toRemoteId(manifest.id);
    loadAppModule(remoteId, manifest.remoteEntry)
      .then(() => setLoadState("loaded"))
      .catch((err: unknown) => {
        console.error("[Korporus] Failed to load remote module:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "Unknown error loading app module.",
        );
        setLoadState("error");
      });
  }, [manifest]);

  useEffect(() => {
    setSettingsSession({ dirty: false, valid: true, saving: false });
  }, [appId, view]);

  useEffect(() => {
    if (!settingsHost) return;
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ state?: SettingsSessionState }>).detail;
      if (!detail?.state) return;
      setSettingsSession({
        dirty: !!detail.state.dirty,
        valid: detail.state.valid !== false,
        saving: !!detail.state.saving,
      });
    };
    settingsHost.addEventListener(SETTINGS_STATE_EVENT, onState);
    return () => settingsHost.removeEventListener(SETTINGS_STATE_EVENT, onState);
  }, [settingsHost]);

  // Manifests still loading from server.
  if (!manifestsLoaded) {
    return (
      <div className="flex flex-col h-screen">
        <ShellChrome />
        <div className="flex-1 flex items-center justify-center bg-background">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </div>
    );
  }

  // Manifests are loaded, but this app id does not exist.
  if (!manifest) {
    return (
      <div className="flex flex-col h-screen">
        <ShellChrome />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-background">
          <AlertCircle className="text-red-400" size={40} />
          <p className="text-foreground font-medium">App not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-primary underline"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  const systemSettingsView = manifest.id === "settings-app" && !settingsView;
  const hasSettingsSlot = !!manifest.slots.settings;
  const settingsComponentAvailable = settingsView ? hasSettingsSlot : systemSettingsView;
  const showSettingsFrame = loadState === "loaded" && settingsComponentAvailable;
  const settingsReturnPath = `/app/${manifest.id}`;

  const handleSave = () => {
    if (!settingsHost || settingsSession.saving) return;
    settingsHost.dispatchEvent(
      new CustomEvent(SETTINGS_SAVE_EVENT, {
        bubbles: true,
        composed: true,
      }),
    );
    if (settingsView) {
      navigate(settingsReturnPath);
    }
  };

  const handleCancel = () => {
    if (!settingsHost || settingsSession.saving) return;
    settingsHost.dispatchEvent(
      new CustomEvent(SETTINGS_CANCEL_EVENT, {
        bubbles: true,
        composed: true,
      }),
    );
    if (settingsView) {
      navigate(settingsReturnPath);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ShellChrome appManifest={manifest} menubarSlotTag={manifest.slots.menubar} />

      <div className="flex-1 flex flex-col overflow-hidden bg-background relative">
        {loadState === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-muted-foreground" size={36} />
            <p className="text-muted-foreground text-sm">Loading {manifest.name}…</p>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <AlertCircle className="text-red-400" size={40} />
            <p className="text-foreground font-medium">Failed to load {manifest.name}</p>
            {errorMessage && (
              <p className="text-muted-foreground text-sm text-center max-w-md">{errorMessage}</p>
            )}
            <p className="text-muted-foreground text-xs text-center max-w-md">
              The app container may still be starting up. Please wait a moment and try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 text-sm text-primary underline"
            >
              Go home
            </button>
          </div>
        )}

        {loadState === "loaded" && settingsView && !manifest.slots.settings && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
            <AlertCircle className="text-muted-foreground" size={34} />
            <p className="text-foreground font-medium">No settings available for {manifest.name}</p>
            <button
              onClick={() => navigate(`/app/${manifest.id}`)}
              className="mt-1 text-sm text-primary underline"
            >
              Back to app
            </button>
          </div>
        )}

        {loadState === "loaded" && (!settingsView || !!manifest.slots.settings) && (
          <div className={`flex-1 overflow-auto bg-background ${showSettingsFrame ? "pb-20" : ""}`}>
            <SlotContainer
              tagName={settingsView ? manifest.slots.settings : manifest.slots.main}
              className="h-full"
              onElementChange={setSettingsHost}
            />
          </div>
        )}
      </div>

      {showSettingsFrame && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 px-4 py-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={settingsSession.saving}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!settingsSession.valid || settingsSession.saving}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {settingsSession.saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
