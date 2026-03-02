import { useEffect, useState } from "react";
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

export function SettingsMain() {
  const [appearance, setLocalAppearance] = useState<AppearanceSettingsV1>(() => readAppearance());
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";

  useEffect(() => {
    return subscribeAppearance((next) => setLocalAppearance(next));
  }, []);

  const updateAppearance = (updater: (prev: AppearanceSettingsV1) => AppearanceSettingsV1) => {
    const next = setAppearance(updater);
    setLocalAppearance(next);
  };

  const setMode = (mode: AppearanceMode) => updateAppearance((prev) => ({ ...prev, mode }));
  const setTheme = (theme: AppearanceTheme) => updateAppearance((prev) => ({ ...prev, theme }));
  const setMotion = (motion: AppearanceMotion) =>
    updateAppearance((prev) => ({ ...prev, motion }));

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: darkMode ? "#0f172a" : "#f8fafc",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: darkMode ? "#f8fafc" : "#0f172a" }}>
          Appearance
        </h2>

        <SettingGroup title="Mode" darkMode={darkMode}>
          <SegmentButton
            label="Light"
            active={appearance.mode === "light"}
            darkMode={darkMode}
            onClick={() => setMode("light")}
          />
          <SegmentButton
            label="Dark"
            active={appearance.mode === "dark"}
            darkMode={darkMode}
            onClick={() => setMode("dark")}
          />
          <SegmentButton
            label="System"
            active={appearance.mode === "system"}
            darkMode={darkMode}
            onClick={() => setMode("system")}
          />
        </SettingGroup>

        <SettingGroup title="Color Theme" darkMode={darkMode}>
          <SegmentButton
            label="Neutral"
            active={appearance.theme === "neutral"}
            darkMode={darkMode}
            onClick={() => setTheme("neutral")}
          />
          <SegmentButton
            label="Cool"
            active={appearance.theme === "cool"}
            darkMode={darkMode}
            onClick={() => setTheme("cool")}
          />
          <SegmentButton
            label="Warm"
            active={appearance.theme === "warm"}
            darkMode={darkMode}
            onClick={() => setTheme("warm")}
          />
        </SettingGroup>

        <SettingGroup title="Motion" darkMode={darkMode}>
          <SegmentButton
            label="Full"
            active={appearance.motion === "full"}
            darkMode={darkMode}
            onClick={() => setMotion("full")}
          />
          <SegmentButton
            label="Reduced"
            active={appearance.motion === "reduced"}
            darkMode={darkMode}
            onClick={() => setMotion("reduced")}
          />
          <SegmentButton
            label="Off"
            active={appearance.motion === "off"}
            darkMode={darkMode}
            onClick={() => setMotion("off")}
          />
        </SettingGroup>
      </div>
    </div>
  );
}
