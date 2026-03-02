import { useEffect, useMemo, useState } from "react";
import {
  readAppearance,
  resolveEffectiveMode,
  setAppearance,
  subscribeAppearance,
  type AppearanceMode,
  type AppearanceMotion,
  type AppearanceSettingsV1,
  type AppearanceTheme,
} from "@korporus/system-settings";
import {
  SettingsScaffold,
  useSettingsSessionBridge,
  type SidebarItem,
} from "@korporus/app-shell-ui";
import type { HostElementProp } from "@korporus/web-component-wrapper";

function SegmentButton({
  label,
  active,
  darkMode,
  onClick,
}: {
  label: string;
  active: boolean;
  darkMode: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active
          ? `1px solid ${darkMode ? "#e2e8f0" : "#0f172a"}`
          : `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
        background: active ? (darkMode ? "#f8fafc" : "#0f172a") : darkMode ? "#111827" : "#ffffff",
        color: active ? (darkMode ? "#0f172a" : "#f8fafc") : darkMode ? "#e2e8f0" : "#0f172a",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SettingGroup({
  title,
  darkMode,
  children,
}: {
  title: string;
  darkMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
        background: darkMode ? "#0b1220" : "#ffffff",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: darkMode ? "#94a3b8" : "#64748b",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "mode", label: "Mode", keywords: ["light", "dark", "system"] },
  { id: "theme", label: "Color Theme", keywords: ["neutral", "cool", "warm"] },
  { id: "motion", label: "Motion", keywords: ["full", "reduced", "off"] },
];

export function SettingsMain(props: HostElementProp) {
  const [persisted, setPersisted] = useState<AppearanceSettingsV1>(() => readAppearance());
  const [draft, setDraft] = useState<AppearanceSettingsV1>(() => readAppearance());
  const [activeItemId, setActiveItemId] = useState<string>("mode");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const darkMode = resolveEffectiveMode(draft.mode) === "dark";

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(persisted),
    [draft, persisted],
  );

  useEffect(() => {
    return subscribeAppearance((next) => {
      setPersisted(next);
      setDraft(next);
    });
  }, []);

  useEffect(() => {
    const filtered = SIDEBAR_ITEMS.filter((item) => {
      const haystack = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase();
      return haystack.includes(searchQuery.toLowerCase());
    });
    if (filtered.length > 0 && !filtered.some((item) => item.id === activeItemId)) {
      setActiveItemId(filtered[0].id);
    }
  }, [searchQuery, activeItemId]);

  const setMode = (mode: AppearanceMode) => setDraft((prev) => ({ ...prev, mode }));
  const setTheme = (theme: AppearanceTheme) => setDraft((prev) => ({ ...prev, theme }));
  const setMotion = (motion: AppearanceMotion) => setDraft((prev) => ({ ...prev, motion }));

  useSettingsSessionBridge({
    hostElement: props.__hostElement ?? null,
    state: {
      dirty,
      valid: true,
      saving,
    },
    onSave: async () => {
      setSaving(true);
      const next = setAppearance(draft);
      setPersisted(next);
      setDraft(next);
      setSaving(false);
    },
    onCancel: () => {
      const current = readAppearance();
      setPersisted(current);
      setDraft(current);
      setSaving(false);
    },
  });

  return (
    <SettingsScaffold
      title="System Settings"
      sidebarItems={SIDEBAR_ITEMS}
      activeItemId={activeItemId}
      onSelectItem={setActiveItemId}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: darkMode ? "#f8fafc" : "#0f172a" }}>
          Appearance
        </h2>

        {activeItemId === "mode" && (
          <SettingGroup title="Mode" darkMode={darkMode}>
            <SegmentButton
              label="Light"
              active={draft.mode === "light"}
              darkMode={darkMode}
              onClick={() => setMode("light")}
            />
            <SegmentButton
              label="Dark"
              active={draft.mode === "dark"}
              darkMode={darkMode}
              onClick={() => setMode("dark")}
            />
            <SegmentButton
              label="System"
              active={draft.mode === "system"}
              darkMode={darkMode}
              onClick={() => setMode("system")}
            />
          </SettingGroup>
        )}

        {activeItemId === "theme" && (
          <SettingGroup title="Color Theme" darkMode={darkMode}>
            <SegmentButton
              label="Neutral"
              active={draft.theme === "neutral"}
              darkMode={darkMode}
              onClick={() => setTheme("neutral")}
            />
            <SegmentButton
              label="Cool"
              active={draft.theme === "cool"}
              darkMode={darkMode}
              onClick={() => setTheme("cool")}
            />
            <SegmentButton
              label="Warm"
              active={draft.theme === "warm"}
              darkMode={darkMode}
              onClick={() => setTheme("warm")}
            />
          </SettingGroup>
        )}

        {activeItemId === "motion" && (
          <SettingGroup title="Motion" darkMode={darkMode}>
            <SegmentButton
              label="Full"
              active={draft.motion === "full"}
              darkMode={darkMode}
              onClick={() => setMotion("full")}
            />
            <SegmentButton
              label="Reduced"
              active={draft.motion === "reduced"}
              darkMode={darkMode}
              onClick={() => setMotion("reduced")}
            />
            <SegmentButton
              label="Off"
              active={draft.motion === "off"}
              darkMode={darkMode}
              onClick={() => setMotion("off")}
            />
          </SettingGroup>
        )}
      </div>
    </SettingsScaffold>
  );
}
