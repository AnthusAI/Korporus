import { useState, useCallback } from "react";
import { loadAppModule } from "./services/moduleLoader";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import HelloAppSlots from "./components/HelloAppSlots";
import { useEffect } from "react";

type LoadState = "idle" | "loading" | "loaded" | "error";

const DEFAULT_REMOTE_ENTRY =
  "https://awdmyggmnm.us-east-1.awsapprunner.com/apps/hello/mf-manifest.json";
const LOCAL_REMOTE_ENTRY = "/apps/hello/mf-manifest.json";

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const remoteEntry =
  import.meta.env.VITE_KORPORUS_REMOTE_ENTRY ??
  (isLocalHost ? LOCAL_REMOTE_ENTRY : DEFAULT_REMOTE_ENTRY);

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const load = useCallback(() => {
    setLoadState("loading");
    loadAppModule("hello_app", remoteEntry)
      .then(() => setLoadState("loaded"))
      .catch((err: unknown) => {
        console.error("[Korporus Demo] Failed to load remote module:", err);
        setLoadState("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Korporus Platform Demo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hello World app running as a federated module
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {loadState === "idle" || loadState === "loading" ? (
          <LoadingState />
        ) : loadState === "error" ? (
          <ErrorState onRetry={load} />
        ) : (
          <HelloAppSlots />
        )}
      </main>

      {/* Info footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-xs text-slate-400 text-center">
            This app loaded the Hello World federated module at runtime from{" "}
            <span className="font-mono text-slate-500 break-all">{remoteEntry}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
