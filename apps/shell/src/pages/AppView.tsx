import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import ShellChrome from "../components/ShellChrome";
import SettingsPanel from "../components/SettingsPanel";
import { useAppManifest } from "../store/registry.js";
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
      {/* Titlebar slot */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <SlotContainer
          tagName={manifest.slots.titlebar}
          className="h-12 flex items-center px-4"
        />
      </div>

      {/* Main content slot */}
      <div className="flex-1 overflow-auto">
        <SlotContainer tagName={manifest.slots.main} className="h-full" />
      </div>
    </>
  );
}

export default function AppView() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const manifest = useAppManifest(appId ?? "");

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

  // Manifest not yet in registry (still loading from server)
  if (!manifest) {
    return (
      <div className="flex flex-col h-screen">
        <ShellChrome />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    );
  }

  // Unknown app id
  if (manifest === undefined) {
    return (
      <div className="flex flex-col h-screen">
        <ShellChrome />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50">
          <AlertCircle className="text-red-400" size={40} />
          <p className="text-gray-600 font-medium">App not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 underline"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ShellChrome
        appName={manifest.name}
        onToggleSettings={() => setSettingsOpen((prev: boolean) => !prev)}
        settingsOpen={settingsOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
        {loadState === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-400" size={36} />
            <p className="text-gray-500 text-sm">Loading {manifest.name}…</p>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <AlertCircle className="text-red-400" size={40} />
            <p className="text-gray-700 font-medium">Failed to load {manifest.name}</p>
            {errorMessage && (
              <p className="text-gray-500 text-sm text-center max-w-md">{errorMessage}</p>
            )}
            <p className="text-gray-400 text-xs text-center max-w-md">
              The app container may still be starting up. Please wait a moment and try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Go home
            </button>
          </div>
        )}

        {loadState === "loaded" && <AppSlots manifest={manifest} />}
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settingsSlotTag={manifest.slots.settings}
      />
    </div>
  );
}
