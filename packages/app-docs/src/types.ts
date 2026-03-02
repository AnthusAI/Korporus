export interface DocEntry {
  /** Relative path without .md extension, e.g. "architecture/module-federation" */
  path: string;
  /** Document title extracted from the first # heading */
  title: string;
  /** Top-level section name, e.g. "architecture" */
  section: string;
  /** All headings in the document */
  headings: DocHeading[];
  /** Plain text content for search indexing */
  searchContent: string;
}

export interface DocHeading {
  depth: number;
  text: string;
  id: string;
}

export interface DocsManifest {
  docs: DocEntry[];
}

export interface SearchResult {
  path: string;
  title: string;
  section: string;
  snippet: string;
}
