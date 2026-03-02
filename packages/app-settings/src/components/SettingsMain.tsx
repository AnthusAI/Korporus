import { useEffect, useState } from "react";
import {
  applyAppearance,
  type AppearanceMode,
  type AppearanceMotion,
  type AppearanceState,
  type AppearanceTheme,
  readAppearance,
} from "../lib/appearance";

function SegmentButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: active ? "#0f172a" : "#ffffff",
        color: active ? "#f8fafc" : "#0f172a",
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

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        background: "#ffffff",
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
          color: "#64748b",
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
  const [appearance, setAppearance] = useState<AppearanceState>(() => readAppearance());

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setAppearance((current) => {
        if (current.mode !== "system") return current;
        return { ...current };
      });
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setMode = (mode: AppearanceMode) => setAppearance((prev) => ({ ...prev, mode }));
  const setTheme = (theme: AppearanceTheme) => setAppearance((prev) => ({ ...prev, theme }));
  const setMotion = (motion: AppearanceMotion) =>
    setAppearance((prev) => ({ ...prev, motion }));

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#f8fafc",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>Appearance</h2>

        <SettingGroup title="Mode">
          <SegmentButton label="Light" active={appearance.mode === "light"} onClick={() => setMode("light")} />
          <SegmentButton label="Dark" active={appearance.mode === "dark"} onClick={() => setMode("dark")} />
          <SegmentButton
            label="System"
            active={appearance.mode === "system"}
            onClick={() => setMode("system")}
          />
        </SettingGroup>

        <SettingGroup title="Color Theme">
          <SegmentButton
            label="Neutral"
            active={appearance.theme === "neutral"}
            onClick={() => setTheme("neutral")}
          />
          <SegmentButton label="Cool" active={appearance.theme === "cool"} onClick={() => setTheme("cool")} />
          <SegmentButton label="Warm" active={appearance.theme === "warm"} onClick={() => setTheme("warm")} />
        </SettingGroup>

        <SettingGroup title="Motion">
          <SegmentButton
            label="Full"
            active={appearance.motion === "full"}
            onClick={() => setMotion("full")}
          />
          <SegmentButton
            label="Reduced"
            active={appearance.motion === "reduced"}
            onClick={() => setMotion("reduced")}
          />
          <SegmentButton label="Off" active={appearance.motion === "off"} onClick={() => setMotion("off")} />
        </SettingGroup>
      </div>
    </div>
  );
}
