import fs from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import type { DocsManifest, DocEntry, DocHeading } from "../types";

const DOCS_DIR = path.resolve(import.meta.dirname, "../../../../docs");

/** Extract title from the first # heading in a markdown string. */
function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

/** Generate a GitHub-compatible slug from heading text. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Extract all headings from a markdown string. */
function extractHeadings(md: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(md)) !== null) {
    headings.push({
      depth: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    });
  }
  return headings;
}

/** Strip markdown syntax to produce plain text for search indexing. */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")   // fenced code blocks
    .replace(/`[^`]+`/g, "")           // inline code
    .replace(/#{1,6}\s+/g, "")         // headings
    .replace(/[*_~]+/g, "")            // bold/italic/strikethrough
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images → alt text
    .replace(/\|/g, " ")               // table pipes
    .replace(/-{3,}/g, "")             // horizontal rules
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Scan the docs directory and build a manifest. */
function buildManifest(): DocsManifest {
  const docs: DocEntry[] = [];

  function scan(dir: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith(".md")) {
        const filePath = path.join(dir, entry.name);
        const md = fs.readFileSync(filePath, "utf-8");
        const baseName = entry.name.replace(/\.md$/, "");
        const docPath = prefix
          ? baseName === "index"
            ? prefix
            : `${prefix}/${baseName}`
          : baseName === "index"
            ? "index"
            : baseName;

        docs.push({
          path: docPath,
          title: extractTitle(md),
          section: prefix.split("/")[0] || "",
          headings: extractHeadings(md),
          searchContent: stripMarkdown(md),
        });
      }
    }
  }

  scan(DOCS_DIR, "");
  return { docs };
}

export function docsPlugin(): Plugin {
  return {
    name: "vite-plugin-docs",

    configureServer(server: ViteDevServer) {
      // Serve docs-manifest.json dynamically in dev
      server.middlewares.use((req, res, next) => {
        if (req.url === "/docs-manifest.json") {
          const manifest = buildManifest();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(manifest));
          return;
        }

        // Serve raw .md files from docs/ directory
        if (req.url?.startsWith("/docs/") && req.url.endsWith(".md")) {
          const relativePath = req.url.slice("/docs/".length);
          const filePath = path.join(DOCS_DIR, relativePath);
          if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "text/markdown");
            res.end(fs.readFileSync(filePath, "utf-8"));
            return;
          }
        }

        // Handle paths without .md extension — try with /index.md or .md appended
        if (req.url?.startsWith("/docs/") && !req.url.includes(".")) {
          const relativePath = req.url.slice("/docs/".length);
          const asFile = path.join(DOCS_DIR, `${relativePath}.md`);
          const asIndex = path.join(DOCS_DIR, relativePath, "index.md");
          const resolved = fs.existsSync(asFile) ? asFile : fs.existsSync(asIndex) ? asIndex : null;
          if (resolved) {
            res.setHeader("Content-Type", "text/markdown");
            res.end(fs.readFileSync(resolved, "utf-8"));
            return;
          }
        }

        next();
      });
    },

    generateBundle() {
      const manifest = buildManifest();

      // Emit docs-manifest.json
      this.emitFile({
        type: "asset",
        fileName: "docs-manifest.json",
        source: JSON.stringify(manifest),
      });

      // Emit each .md file as a static asset
      function emitFiles(plugin: any, dir: string, prefix: string) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            emitFiles(plugin, path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
          } else if (entry.name.endsWith(".md")) {
            const filePath = path.join(dir, entry.name);
            const assetPath = prefix ? `docs/${prefix}/${entry.name}` : `docs/${entry.name}`;
            plugin.emitFile({
              type: "asset",
              fileName: assetPath,
              source: fs.readFileSync(filePath, "utf-8"),
            });
          }
        }
      }

      emitFiles(this, DOCS_DIR, "");
    },
  };
}
