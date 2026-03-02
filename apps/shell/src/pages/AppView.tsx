import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import ShellChrome from "../components/ShellChrome";
import { useRegistry } from "../store/registry.js";
import { loadAppModule, toRemoteId } from "../services/moduleLoader.js";
import type { AppManifest } from "@korporus/app-manifest";

type LoadState = "idle" | "loading" | "loaded" | "error";

function SlotContainer({
  tagName,
  className,
}: {
  tagName: string | undefined;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tagName || !ref.current) return;
    const el = document.createElement(tagName);
    ref.current.innerHTML = "";
    ref.current.appendChild(el);
    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [tagName]);

  return <div ref={ref} className={className} />;
}

function AppSlots({ manifest }: { manifest: AppManifest }) {
  return (
    <>
      {/* Main content slot */}
      <div className="flex-1 overflow-auto bg-background">
        <SlotContainer tagName={manifest.slots.main} className="h-full" />
      </div>
    </>
  );
}

export default function AppView() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const appKey = appId ?? "";
  const { loaded: manifestsLoaded, manifest } = useRegistry((s) => ({
    loaded: s.loaded,
    manifest: s.apps.find((a) => a.id === appKey),
  }));

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

  return (
    <div className="flex flex-col h-screen">
      <ShellChrome appName={manifest.name} menubarSlotTag={manifest.slots.menubar} />

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

        {loadState === "loaded" && <AppSlots manifest={manifest} />}
      </div>
    </div>
  );
}
