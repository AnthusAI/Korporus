import { useEffect, useMemo, useRef } from "react";
import { useDocsStore } from "../store";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { resolveEffectiveMode } from "@korporus/system-settings";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";
import { buildSearchIndex, search } from "../lib/searchIndex";
import { HelpScaffold, type SidebarItem } from "@korporus/app-shell-ui";

declare const __DOCS_BASE_URL__: string;

export function DocsMain() {
  const currentPath = useDocsStore((s) => s.currentPath);
  const content = useDocsStore((s) => s.content);
  const loading = useDocsStore((s) => s.loading);
  const manifest = useDocsStore((s) => s.manifest);
  const setManifest = useDocsStore((s) => s.setManifest);
  const setContent = useDocsStore((s) => s.setContent);
  const setLoading = useDocsStore((s) => s.setLoading);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);
  const searchQuery = useDocsStore((s) => s.searchQuery);
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery);
  const searchResults = useDocsStore((s) => s.searchResults);
  const setSearchResults = useDocsStore((s) => s.setSearchResults);
  const appearance = useAppearanceSettings();
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";
  const smoothScroll = appearance.motion === "full";
  const initialContextHandled = useRef(false);
  const searchIndexBuilt = useRef(false);

  // Load manifest on mount
  useEffect(() => {
    if (manifest) return;
    fetch(`${__DOCS_BASE_URL__}/docs-manifest.json`)
      .then((r) => r.json())
      .then((data) => setManifest(data))
      .catch((err) => console.warn("[Docs] Failed to load manifest:", err));
  }, [manifest, setManifest]);

  // Build search index once manifest is ready.
  useEffect(() => {
    if (!manifest || searchIndexBuilt.current) return;
    buildSearchIndex(manifest);
    searchIndexBuilt.current = true;
  }, [manifest]);

  // Handle app-context help entry once per mount.
  useEffect(() => {
    if (!manifest || initialContextHandled.current) return;
    initialContextHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    const contextAppId = params.get("contextAppId");
    const entry = params.get("entry");

    if (entry === "app-help" && contextAppId) {
      const preferredPath = `apps/${contextAppId}`;
      const exists = manifest.docs.some((doc) => doc.path === preferredPath);
      if (exists) {
        setCurrentPath(preferredPath);
      } else {
        setCurrentPath("index");
      }
      return;
    }

    if (!manifest.docs.some((doc) => doc.path === currentPath)) {
      setCurrentPath("index");
    }
  }, [manifest, currentPath, setCurrentPath]);

  // Load document content when path changes.
  useEffect(() => {
    setLoading(true);
    fetch(`${__DOCS_BASE_URL__}/docs/${currentPath}.md`)
      .then(async (r) => {
        if (r.ok) return r.text();
        const fallback = await fetch(`${__DOCS_BASE_URL__}/docs/${currentPath}/index.md`);
        if (!fallback.ok) throw new Error(`HTTP ${fallback.status}`);
        return fallback.text();
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

  // Perform docs search from sidebar query.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearchResults(search(searchQuery, 50));
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchResults]);

  // Scroll to hash anchor after content renders.
  useEffect(() => {
    if (loading || !content) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: smoothScroll ? "smooth" : "auto",
      });
    });
  }, [loading, content, smoothScroll]);

  const sidebarItems = useMemo<SidebarItem[]>(() => {
    if (!manifest) return [];

    if (searchQuery.trim()) {
      return searchResults.map((result) => ({
        id: result.path,
        label: result.title,
        keywords: [result.section, result.snippet],
      }));
    }

    const docs = [...manifest.docs].sort((a, b) => a.path.localeCompare(b.path));
    return docs.map((doc) => ({
      id: doc.path,
      label: doc.path === "index" ? "Help Home" : doc.title,
      keywords: [doc.path, doc.section],
    }));
  }, [manifest, searchQuery, searchResults]);

  return (
    <HelpScaffold
      title="Help"
      sidebarItems={sidebarItems}
      activeItemId={currentPath}
      onSelectItem={setCurrentPath}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      {loading && <p style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Loading...</p>}
      {!loading && content === null && (
        <p style={{ color: darkMode ? "#fda4af" : "#ef4444" }}>Document not found.</p>
      )}
      {!loading && content !== null && (
        <div style={{ maxWidth: 760, lineHeight: 1.7 }}>
          <MarkdownRenderer markdown={content} />
        </div>
      )}
    </HelpScaffold>
  );
}
