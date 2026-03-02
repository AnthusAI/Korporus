import { useMemo } from "react";
import { useDocsStore } from "../store";
import { resolveEffectiveMode } from "@korporus/system-settings";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";

export function DocsMenubar() {
  const currentPath = useDocsStore((s) => s.currentPath);
  const manifest = useDocsStore((s) => s.manifest);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);
  const appearance = useAppearanceSettings();
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";

  const crumbs = useMemo(() => {
    const segments = currentPath === "index" ? [] : currentPath.split("/");
    const result: { label: string; path: string }[] = [{ label: "Help", path: "index" }];

    for (let i = 0; i < segments.length; i++) {
      const partialPath = segments.slice(0, i + 1).join("/");
      const doc = manifest?.docs.find((d) => d.path === partialPath);
      const label = doc?.title ?? segments[i].replace(/-/g, " ");
      result.push({ label, path: partialPath });
    }

    return result;
  }, [currentPath, manifest]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        fontFamily: "system-ui, sans-serif",
        color: darkMode ? "#e2e8f0" : "#0f172a",
        overflow: "hidden",
      }}
    >
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {i > 0 && <span style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>/</span>}
          <button
            type="button"
            onClick={() => setCurrentPath(crumb.path)}
            style={{
              cursor: i < crumbs.length - 1 ? "pointer" : "default",
              color: i < crumbs.length - 1 ? (darkMode ? "#93c5fd" : "#2563eb") : darkMode ? "#e2e8f0" : "#0f172a",
              fontWeight: i === crumbs.length - 1 ? 600 : 500,
              fontSize: 13,
              whiteSpace: "nowrap",
              border: 0,
              background: "transparent",
              padding: 0,
            }}
          >
            {crumb.label}
          </button>
        </span>
      ))}
    </div>
  );
}
