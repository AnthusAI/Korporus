import { useEffect, useMemo, useState } from "react";
import { SettingsScaffold, useSettingsSessionBridge, type SidebarItem } from "@korporus/app-shell-ui";
import { resolveEffectiveMode } from "@korporus/system-settings";
import { GREETINGS } from "../data/greetings";
import { useHelloStore } from "../store";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "language", label: "Language", keywords: ["greeting", "locale"] },
];

export function HelloSettings() {
  const language = useHelloStore((s) => s.language);
  const setLanguage = useHelloStore((s) => s.setLanguage);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [searchQuery, setSearchQuery] = useState("");
  const appearance = useAppearanceSettings();
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";

  useEffect(() => {
    setDraftLanguage(language);
  }, [language]);

  const dirty = useMemo(() => draftLanguage !== language, [draftLanguage, language]);

  useSettingsSessionBridge({
    state: {
      dirty,
      valid: true,
      saving: false,
    },
    onSave: () => {
      setLanguage(draftLanguage);
    },
    onCancel: () => {
      setDraftLanguage(language);
    },
  });

  return (
    <SettingsScaffold
      title="Hello Settings"
      sidebarItems={SIDEBAR_ITEMS}
      activeItemId="language"
      onSelectItem={() => undefined}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: 20,
          border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          borderRadius: 12,
          background: darkMode ? "#0f172a" : "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, color: darkMode ? "#e2e8f0" : "#0f172a" }}>
          Hello Settings
        </h2>
        <p style={{ margin: "8px 0 16px", fontSize: 14, color: darkMode ? "#94a3b8" : "#64748b" }}>
          Choose the default greeting language for this app.
        </p>

        <label
          htmlFor="hello-settings-language"
          style={{
            display: "block",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: darkMode ? "#94a3b8" : "#64748b",
            marginBottom: 6,
          }}
        >
          Language
        </label>
        <select
          id="hello-settings-language"
          value={draftLanguage}
          onChange={(e) => setDraftLanguage(e.target.value)}
          style={{
            width: "100%",
            border: `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 14,
            background: darkMode ? "#111827" : "#ffffff",
            color: darkMode ? "#e2e8f0" : "#0f172a",
          }}
        >
          {Object.entries(GREETINGS).map(([code, { label }]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </SettingsScaffold>
  );
}
