import { useMemo } from "react";
import { readAppearance, resolveEffectiveMode, subscribeAppearance } from "@korporus/system-settings";
import { useEffect, useState } from "react";

export interface SidebarItem {
  id: string;
  label: string;
  keywords?: string[];
}

export interface SettingsScaffoldProps {
  title: string;
  searchPlaceholder?: string;
  sidebarItems: SidebarItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  children: React.ReactNode;
}

export interface HelpScaffoldProps {
  title: string;
  searchPlaceholder?: string;
  sidebarItems: SidebarItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  children: React.ReactNode;
}

export function filterSidebarItems(items: SidebarItem[], query: string): SidebarItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => {
    const haystack = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}

function useDarkMode(): boolean {
  const [darkMode, setDarkMode] = useState(() => resolveEffectiveMode(readAppearance().mode) === "dark");

  useEffect(() => {
    return subscribeAppearance((next) => {
      setDarkMode(resolveEffectiveMode(next.mode) === "dark");
    });
  }, []);

  return darkMode;
}

function BaseScaffold({
  title,
  searchPlaceholder,
  sidebarItems,
  activeItemId,
  onSelectItem,
  searchQuery,
  onSearchQueryChange,
  children,
}: {
  title: string;
  searchPlaceholder?: string;
  sidebarItems: SidebarItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  children: React.ReactNode;
}) {
  const darkMode = useDarkMode();
  const filteredItems = useMemo(
    () => filterSidebarItems(sidebarItems, searchQuery),
    [sidebarItems, searchQuery],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        height: "100%",
        background: darkMode ? "#0b1220" : "#f8fafc",
        color: darkMode ? "#e2e8f0" : "#0f172a",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <aside
        style={{
          borderRight: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
          background: darkMode ? "#0f172a" : "#ffffff",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div style={{ padding: 12, borderBottom: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}` }}>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: darkMode ? "#94a3b8" : "#64748b", marginBottom: 8 }}>
            {title}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={searchPlaceholder ?? "Search..."}
            style={{
              width: "100%",
              border: `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
              borderRadius: 8,
              padding: "7px 9px",
              fontSize: 13,
              background: darkMode ? "#111827" : "#ffffff",
              color: darkMode ? "#e2e8f0" : "#0f172a",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ padding: 8, overflowY: "auto", minHeight: 0 }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const active = activeItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(item.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: 0,
                    borderRadius: 8,
                    padding: "8px 10px",
                    marginBottom: 4,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? (darkMode ? "#bfdbfe" : "#1d4ed8") : darkMode ? "#cbd5e1" : "#334155",
                    background: active ? (darkMode ? "#1e293b" : "#eff6ff") : "transparent",
                  }}
                >
                  {item.label}
                </button>
              );
            })
          ) : (
            <div style={{ padding: "8px 10px", fontSize: 12, color: darkMode ? "#94a3b8" : "#64748b" }}>
              No matches.
            </div>
          )}
        </div>
      </aside>

      <section style={{ minHeight: 0, overflowY: "auto", padding: 20 }}>
        {children}
      </section>
    </div>
  );
}

export function SettingsScaffold(props: SettingsScaffoldProps): React.ReactElement {
  return <BaseScaffold {...props} searchPlaceholder={props.searchPlaceholder ?? "Search settings..."} />;
}

export function HelpScaffold(props: HelpScaffoldProps): React.ReactElement {
  return <BaseScaffold {...props} searchPlaceholder={props.searchPlaceholder ?? "Search help..."} />;
}
