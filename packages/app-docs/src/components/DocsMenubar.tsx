import { useEffect, useRef, useState } from "react";
import { useDocsStore } from "../store";
import { buildSearchIndex, search } from "../lib/searchIndex";
import { resolveEffectiveMode } from "@korporus/system-settings";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";

export function DocsMenubar() {
  const currentPath = useDocsStore((s) => s.currentPath);
  const manifest = useDocsStore((s) => s.manifest);
  const searchQuery = useDocsStore((s) => s.searchQuery);
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery);
  const searchResults = useDocsStore((s) => s.searchResults);
  const setSearchResults = useDocsStore((s) => s.setSearchResults);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);
  const indexBuilt = useRef(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const appearance = useAppearanceSettings();
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";

  useEffect(() => {
    if (!manifest || indexBuilt.current) return;
    buildSearchIndex(manifest);
    indexBuilt.current = true;
  }, [manifest]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearchResults(search(searchQuery));
      setResultsOpen(true);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchResults]);

  const segments = currentPath === "index" ? [] : currentPath.split("/");
  const crumbs: { label: string; path: string }[] = [{ label: "Help", path: "index" }];

  for (let i = 0; i < segments.length; i++) {
    const partialPath = segments.slice(0, i + 1).join("/");
    const doc = manifest?.docs.find((d) => d.path === partialPath);
    const label = doc?.title ?? segments[i].replace(/-/g, " ");
    crumbs.push({ label, path: partialPath });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        fontFamily: "system-ui, sans-serif",
        color: darkMode ? "#e2e8f0" : "#0f172a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
        {crumbs.map((crumb, i) => (
          <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>/</span>}
            <span
              onClick={() => setCurrentPath(crumb.path)}
              style={{
                cursor: i < crumbs.length - 1 ? "pointer" : "default",
                color: i < crumbs.length - 1 ? (darkMode ? "#93c5fd" : "#2563eb") : darkMode ? "#e2e8f0" : "#0f172a",
                fontWeight: i === crumbs.length - 1 ? 600 : 500,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      <div style={{ position: "relative", width: 320, maxWidth: "50%" }}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search help..."
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setResultsOpen(true);
          }}
          onFocus={() => setResultsOpen(true)}
          onBlur={() => setTimeout(() => setResultsOpen(false), 120)}
          style={{
            width: "100%",
            border: `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 13,
            boxSizing: "border-box",
            background: darkMode ? "#0f172a" : "#ffffff",
            color: darkMode ? "#e2e8f0" : "#0f172a",
          }}
        />
        {resultsOpen && searchQuery.trim() && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              maxHeight: 320,
              overflowY: "auto",
              border: `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
              borderRadius: 8,
              background: darkMode ? "#0b1220" : "#ffffff",
              boxShadow: darkMode
                ? "0 10px 30px rgba(2, 6, 23, 0.45)"
                : "0 10px 30px rgba(15, 23, 42, 0.08)",
              zIndex: 100,
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  key={result.path}
                  type="button"
                  onClick={() => {
                    setCurrentPath(result.path);
                    setSearchQuery("");
                    setSearchResults([]);
                    setResultsOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    border: 0,
                    borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#e2e8f0" : "#0f172a" }}>
                    {result.title}
                  </div>
                  <div style={{ fontSize: 11, color: darkMode ? "#94a3b8" : "#64748b", marginTop: 2 }}>
                    {result.section}
                  </div>
                  {result.snippet && (
                    <div style={{ fontSize: 12, color: darkMode ? "#cbd5e1" : "#475569", marginTop: 4 }}>
                      {result.snippet}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div style={{ padding: "10px 12px", fontSize: 12, color: darkMode ? "#94a3b8" : "#64748b" }}>
                No results found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
