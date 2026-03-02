import { useDocsStore } from "../store";

export function DocsTitlebar() {
  const currentPath = useDocsStore((s) => s.currentPath);
  const manifest = useDocsStore((s) => s.manifest);

  const segments = currentPath === "index" ? [] : currentPath.split("/");
  const crumbs: { label: string; path: string }[] = [{ label: "Docs", path: "index" }];

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
        gap: 8,
        height: "100%",
        padding: "0 16px",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        color: "#334155",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <span style={{ color: "#94a3b8" }}>/</span>}
          <span
            onClick={() => useDocsStore.getState().setCurrentPath(crumb.path)}
            style={{
              cursor: i < crumbs.length - 1 ? "pointer" : "default",
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
              color: i < crumbs.length - 1 ? "#3b82f6" : "#334155",
            }}
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </div>
  );
}
