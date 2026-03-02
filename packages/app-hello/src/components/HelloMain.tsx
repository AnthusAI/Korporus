import { useHelloStore } from "../store";
import { GREETINGS } from "../data/greetings";
import { resolveEffectiveMode } from "@korporus/system-settings";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";

export function HelloMain() {
  const language = useHelloStore((s) => s.language);
  const langInfo = GREETINGS[language] ?? GREETINGS["en"];
  const appearance = useAppearanceSettings();
  const darkMode = resolveEffectiveMode(appearance.mode) === "dark";
  const transitionMs =
    appearance.motion === "off" ? 0 : appearance.motion === "reduced" ? 120 : 260;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: darkMode
          ? "radial-gradient(circle at top, #111827 0%, #0f172a 60%, #020617 100%)"
          : "radial-gradient(circle at top, #f8fafc 0%, #e2e8f0 60%, #cbd5e1 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: "32px",
        boxSizing: "border-box",
        transition: `background ${transitionMs}ms ease`,
      }}
    >
      <p
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 700,
          color: darkMode ? "#e2e8f0" : "#1e293b",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
          textShadow: darkMode ? "0 0 18px rgba(56, 189, 248, 0.28)" : "0 0 12px rgba(15, 23, 42, 0.12)",
          transition: `color ${transitionMs}ms ease, text-shadow ${transitionMs}ms ease`,
        }}
      >
        {langInfo.greeting}
      </p>
    </div>
  );
}
