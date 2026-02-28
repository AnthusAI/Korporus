import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShellChrome from "./components/ShellChrome";
import Home from "./pages/Home";
import AppView from "./pages/AppView";
import { loadManifests } from "./services/manifestLoader.js";
import { useRegistry } from "./store/registry.js";

function ManifestLoader({ children }: { children: React.ReactNode }) {
  const setApps = useRegistry((s) => s.setApps);
  useEffect(() => {
    loadManifests().then(setApps);
  }, [setApps]);
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ManifestLoader>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ShellChrome />
                <Home />
              </>
            }
          />
          <Route path="/app/:appId" element={<AppView />} />
        </Routes>
      </ManifestLoader>
    </BrowserRouter>
  );
}
