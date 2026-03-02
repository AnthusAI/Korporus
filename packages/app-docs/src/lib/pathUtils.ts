/**
 * Resolve a relative doc link against the current document path.
 *
 * Examples:
 *   resolvePath("architecture/shell", "./manifests")        → "architecture/manifests"
 *   resolvePath("architecture/shell", "../guides/styling")  → "guides/styling"
 *   resolvePath("getting-started/index", "./installation")  → "getting-started/installation"
 *   resolvePath("index", "./getting-started")               → "getting-started"
 */
export function resolvePath(currentPath: string, href: string): string {
  // Strip .md extension and anchor fragments
  let target = href.replace(/\.md$/, "").replace(/#.*$/, "");

  // Absolute paths (starting with /) are treated as-is from doc root
  if (target.startsWith("/")) {
    return target.slice(1) || "index";
  }

  // Get the directory of the current path
  const parts = currentPath.split("/");
  // If current is "architecture/shell", directory is ["architecture"]
  // If current is "index", directory is []
  const dir = parts.length > 1 ? parts.slice(0, -1) : [];

  // Resolve relative segments
  const segments = [...dir, ...target.split("/")];
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") {
      resolved.pop();
    } else {
      resolved.push(seg);
    }
  }

  return resolved.join("/") || "index";
}
