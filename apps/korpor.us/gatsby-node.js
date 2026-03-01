const path = require("path");
const fs = require("fs");

const DOCS_ROOT = path.resolve(__dirname, "../../docs");

const LEGACY_DOC_ROUTE_MAP = [
  { route: "/docs/cli", source: "docs/reference/shell-api.md", title: "Shell API" },
  { route: "/docs/configuration", source: "docs/reference/app-manifest-schema.md", title: "App Manifest Schema" },
  { route: "/docs/directory-structure", source: "docs/getting-started/first-app.md", title: "Directory Structure" },
  { route: "/docs/features/core-management", source: "docs/architecture/shell.md", title: "Shell Host" },
  { route: "/docs/features/kanban-board", source: "docs/architecture/module-federation.md", title: "Runtime Composition" },
  { route: "/docs/features/jira-sync", source: "docs/architecture/manifests.md", title: "Manifest Discovery" },
  { route: "/docs/features/local-tasks", source: "docs/architecture/web-components.md", title: "Web Component Slots" },
  { route: "/docs/features/virtual-projects", source: "docs/guides/creating-an-app.md", title: "Cross-Framework Hosts" },
  { route: "/docs/features/beads-compatibility", source: "docs/guides/state-management.md", title: "Shared State" },
  { route: "/docs/features/vscode-plugin", source: "docs/guides/styling.md", title: "Styling and UX" },
  { route: "/docs/features/integrated-wiki", source: "docs/reference/index.md", title: "Documentation Pipeline" },
  { route: "/docs/features/policy-as-code", source: "docs/guides/deployment.md", title: "Deployment Topology" }
];

const toPosix = (value) => value.replace(/\\/g, "/");

const extractMarkdownTitle = (markdown, fallbackTitle) => {
  const match = markdown.match(/^#\s+(.+)$/m);
  return (match?.[1] || fallbackTitle).trim();
};

const getMarkdownFiles = (rootDir) => {
  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(absolutePath);
      }
    }
  }

  return files;
};

const routeFromDocsRelativePath = (relativePath) => {
  if (relativePath === "index.md") {
    return "/docs";
  }

  if (relativePath.endsWith("/index.md")) {
    return `/docs/${relativePath.slice(0, -"/index.md".length)}`;
  }

  return `/docs/${relativePath.slice(0, -".md".length)}`;
};

const readMarkdown = (absoluteSourcePath, sourcePathForMessage) => {
  try {
    return fs.readFileSync(absoluteSourcePath, "utf8");
  } catch {
    return `# Missing content\n\nSource file not found: ${sourcePathForMessage}`;
  }
};

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const alias = {
    "@korporus/site-ui": path.resolve(__dirname, "src/components/ui/index.tsx")
  };

  if (stage === "build-html" || stage === "develop-html") {
    alias["@radix-ui/react-scroll-area"] = path.resolve(__dirname, "src/mocks/empty-module.js");
    alias["@radix-ui/react-tabs"] = path.resolve(__dirname, "src/mocks/empty-module.js");
    alias.gsap = path.resolve(__dirname, "src/mocks/empty-module.js");
  }

  const config = {
    resolve: {
      alias
    }
  };

  if (stage === "develop" || stage === "develop-html") {
    config.watchOptions = {
      ignored: ["**/public/**", "**/.cache/**"]
    };
  }

  actions.setWebpackConfig(config);
};

function suppressVirtualModuleLoop() {
  try {
    const reduxPath = require.resolve("gatsby/dist/redux", {
      paths: [__dirname]
    });
    const redux = require(reduxPath);
    const emitter = redux.emitter;
    if (!emitter || typeof emitter.emit !== "function") return;
    const originalEmit = emitter.emit.bind(emitter);
    emitter.emit = (eventName, payload) => {
      if (eventName === "SOURCE_FILE_CHANGED" && payload != null) {
        const pathStr =
          typeof payload === "string"
            ? payload
            : payload?.file ?? payload?.payload?.file;
        if (
          pathStr &&
          (String(pathStr).includes(".cache") ||
            String(pathStr).includes("_this_is_virtual_fs_path_"))
        ) {
          return;
        }
      }
      return originalEmit(eventName, payload);
    };
  } catch {
    // ignore if resolve or patch fails
  }
}

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const templatePath = path.resolve(__dirname, "src/templates/DocsMarkdownTemplate.tsx");
  const repoRoot = path.resolve(__dirname, "../..");

  const docsFiles = getMarkdownFiles(DOCS_ROOT);
  const pageEntries = new Map();

  for (const docsFile of docsFiles) {
    const relativeFromDocsRoot = toPosix(path.relative(DOCS_ROOT, docsFile));
    const sourcePath = `docs/${relativeFromDocsRoot}`;
    const markdown = readMarkdown(docsFile, sourcePath);
    const route = routeFromDocsRelativePath(relativeFromDocsRoot);
    const title = extractMarkdownTitle(markdown, route.split("/").pop() || "Documentation");

    pageEntries.set(route, {
      route,
      sourcePath,
      title,
      markdown
    });
  }

  for (const legacy of LEGACY_DOC_ROUTE_MAP) {
    if (pageEntries.has(legacy.route)) {
      continue;
    }

    const absoluteSourcePath = path.resolve(repoRoot, legacy.source);
    const markdown = readMarkdown(absoluteSourcePath, legacy.source);

    pageEntries.set(legacy.route, {
      route: legacy.route,
      sourcePath: legacy.source,
      title: legacy.title,
      markdown
    });
  }

  for (const entry of pageEntries.values()) {
    createPage({
      path: entry.route,
      component: templatePath,
      context: {
        currentPath: entry.route,
        sourcePath: entry.sourcePath,
        title: entry.title,
        markdown: entry.markdown
      }
    });
  }
};

exports.onPreInit = () => {
  suppressVirtualModuleLoop();

  if (process.env.GATSBY_VIDEOS_BASE_URL) {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    return;
  }

  const outputsPath = path.resolve(__dirname, "../../amplify_outputs.json");
  if (!fs.existsSync(outputsPath)) {
    return;
  }

  try {
    const outputs = JSON.parse(fs.readFileSync(outputsPath, "utf8"));
    const cdnUrl = outputs?.custom?.videosCdnUrl;
    if (cdnUrl) {
      process.env.GATSBY_VIDEOS_BASE_URL = cdnUrl;
    }
  } catch {
    // amplify_outputs.json present but unreadable
  }
};
