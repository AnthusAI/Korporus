import { useEffect } from "react";
import { useDocsStore } from "../store";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function DocsMain() {
  const currentPath = useDocsStore((s) => s.currentPath);
  const content = useDocsStore((s) => s.content);
  const loading = useDocsStore((s) => s.loading);
  const manifest = useDocsStore((s) => s.manifest);
  const setManifest = useDocsStore((s) => s.setManifest);
  const setContent = useDocsStore((s) => s.setContent);
  const setLoading = useDocsStore((s) => s.setLoading);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);
  const sidebarOpen = useDocsStore((s) => s.sidebarOpen);
  const toggleSidebar = useDocsStore((s) => s.toggleSidebar);

  // Load manifest on mount
  useEffect(() => {
    if (manifest) return;
    fetch("/docs-manifest.json")
      .then((r) => r.json())
      .then((data) => setManifest(data))
      .catch((err) => console.warn("[Docs] Failed to load manifest:", err));
  }, [manifest, setManifest]);

  // Load document content when path changes
  useEffect(() => {
    setLoading(true);
    fetch(`/docs/${currentPath}.md`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((md) => {
        setContent(md);
        setLoading(false);
      })
      .catch(() => {
        setContent(null);
        setLoading(false);
      });
  }, [currentPath, setContent, setLoading]);

  // Build sidebar sections from manifest
  const sections = buildSections(manifest);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "system-ui, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <nav
          style={{
            width: 240,
            minWidth: 240,
            borderRight: "1px solid #e2e8f0",
            overflowY: "auto",
            padding: "12px 0",
            fontSize: 13,
          }}
        >
          <div
            onClick={() => setCurrentPath("index")}
            style={{
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: currentPath === "index" ? 600 : 400,
              color: currentPath === "index" ? "#3b82f6" : "#475569",
            }}
          >
            Home
          </div>
          {sections.map((section) => (
            <SidebarSection
              key={section.name}
              section={section}
              currentPath={currentPath}
              onNavigate={setCurrentPath}
            />
          ))}
        </nav>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: 12,
            color: "#64748b",
            marginBottom: 16,
          }}
        >
          {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        </button>

        {loading && <p style={{ color: "#94a3b8" }}>Loading...</p>}
        {!loading && content === null && (
          <p style={{ color: "#ef4444" }}>Document not found.</p>
        )}
        {!loading && content !== null && (
          <div style={{ maxWidth: 720, lineHeight: 1.7 }}>
            <MarkdownRenderer markdown={content} />
          </div>
        )}
      </div>
    </div>
  );
}


interface SectionData {
  name: string;
  label: string;
  docs: { path: string; title: string }[];
}

function buildSections(manifest: import("../types").DocsManifest | null): SectionData[] {
  if (!manifest) return [];
  const map = new Map<string, SectionData>();
  for (const doc of manifest.docs) {
    if (doc.path === "index") continue;
    const section = doc.section || "_root";
    if (!map.has(section)) {
      map.set(section, {
        name: section,
        label: section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        docs: [],
      });
    }
    map.get(section)!.docs.push({ path: doc.path, title: doc.title });
  }
  return Array.from(map.values());
}

function SidebarSection({
  section,
  currentPath,
  onNavigate,
}: {
  section: SectionData;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const expanded = useDocsStore((s) => s.expandedSections.has(section.name));
  const toggleSection = useDocsStore((s) => s.toggleSection);
  const isActive = currentPath.startsWith(section.name);

  // Auto-expand the active section
  useEffect(() => {
    if (isActive && !expanded) {
      toggleSection(section.name);
    }
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginTop: 4 }}>
      <div
        onClick={() => toggleSection(section.name)}
        style={{
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 10 }}>{expanded ? "▼" : "▶"}</span>
        {section.label}
      </div>
      {expanded &&
        section.docs.map((doc) => (
          <div
            key={doc.path}
            onClick={() => onNavigate(doc.path)}
            style={{
              padding: "4px 16px 4px 28px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: currentPath === doc.path ? 600 : 400,
              color: currentPath === doc.path ? "#3b82f6" : "#475569",
              backgroundColor: currentPath === doc.path ? "#eff6ff" : "transparent",
              borderRadius: 4,
              margin: "0 4px",
            }}
          >
            {doc.title}
          </div>
        ))}
    </div>
  );
}
