import FlexSearch from "flexsearch";
import type { DocsManifest, SearchResult } from "../types";

let index: FlexSearch.Index | null = null;
let docMap: Map<number, { path: string; title: string; section: string; content: string }> = new Map();

export function buildSearchIndex(manifest: DocsManifest): void {
  index = new FlexSearch.Index({ tokenize: "forward", resolution: 9 });
  docMap = new Map();

  for (let i = 0; i < manifest.docs.length; i++) {
    const doc = manifest.docs[i];
    const text = `${doc.title} ${doc.searchContent}`;
    index.add(i, text);
    docMap.set(i, {
      path: doc.path,
      title: doc.title,
      section: doc.section,
      content: doc.searchContent,
    });
  }
}

export function search(query: string, limit = 10): SearchResult[] {
  if (!index || !query.trim()) return [];

  const ids = index.search(query, limit) as number[];
  return ids.map((id) => {
    const doc = docMap.get(id)!;
    const snippet = extractSnippet(doc.content, query);
    return {
      path: doc.path,
      title: doc.title,
      section: doc.section,
      snippet,
    };
  });
}

function extractSnippet(content: string, query: string): string {
  const lower = content.toLowerCase();
  const queryLower = query.toLowerCase();
  const idx = lower.indexOf(queryLower);
  if (idx === -1) return content.slice(0, 120) + "...";

  const start = Math.max(0, idx - 50);
  const end = Math.min(content.length, idx + query.length + 80);
  let snippet = content.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet;
}
