import { create } from "zustand";
import type { DocsManifest, SearchResult } from "./types";

interface DocsStore {
  /** Current document path, e.g. "architecture/module-federation" */
  currentPath: string;
  setCurrentPath: (path: string) => void;

  /** Document manifest loaded from docs-manifest.json */
  manifest: DocsManifest | null;
  setManifest: (manifest: DocsManifest) => void;

  /** Raw markdown content of the current document */
  content: string | null;
  loading: boolean;
  setContent: (content: string | null) => void;
  setLoading: (loading: boolean) => void;

  /** Search state */
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;

  /** Sidebar navigation */
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
}

export const useDocsStore = create<DocsStore>((set) => ({
  currentPath: "index",
  setCurrentPath: (currentPath) => set({ currentPath }),

  manifest: null,
  setManifest: (manifest) => set({ manifest }),

  content: null,
  loading: false,
  setContent: (content) => set({ content }),
  setLoading: (loading) => set({ loading }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  searchResults: [],
  setSearchResults: (searchResults) => set({ searchResults }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  expandedSections: new Set<string>(),
  toggleSection: (section) =>
    set((s) => {
      const next = new Set(s.expandedSections);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return { expandedSections: next };
    }),
}));
