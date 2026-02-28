import { useEffect, useRef } from "react";
import { useDocsStore } from "../store";
import { buildSearchIndex, search } from "../lib/searchIndex";

export function DocsSettings() {
  const searchQuery = useDocsStore((s) => s.searchQuery);
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery);
  const searchResults = useDocsStore((s) => s.searchResults);
  const setSearchResults = useDocsStore((s) => s.setSearchResults);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);
  const manifest = useDocsStore((s) => s.manifest);
  const indexBuilt = useRef(false);

  // Build search index when manifest loads
  useEffect(() => {
    if (manifest && !indexBuilt.current) {
      buildSearchIndex(manifest);
      indexBuilt.current = true;
    }
  }, [manifest]);

  // Search on query change (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearchResults(search(searchQuery));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchResults]);

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        color: "#334155",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 12 }}>Search</div>
      <input
        type="text"
        placeholder="Search docs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "8px 10px",
          border: "1px solid #cbd5e1",
          borderRadius: 6,
          fontSize: 13,
          outline: "none",
        }}
      />
      {searchResults.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {searchResults.map((result) => (
            <div
              key={result.path}
              onClick={() => setCurrentPath(result.path)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                borderRadius: 4,
                marginBottom: 4,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{result.title}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                {result.section}
              </div>
              {result.snippet && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {result.snippet}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {searchQuery && searchResults.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: 12 }}>No results found.</p>
      )}
    </div>
  );
}
