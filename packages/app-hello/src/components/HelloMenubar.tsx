import { GREETINGS } from "../data/greetings";
import { useHelloStore } from "../store";

export function HelloMenubar() {
  const language = useHelloStore((s) => s.language);
  const setLanguage = useHelloStore((s) => s.setLanguage);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 28,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Hello World</span>
      <label
        htmlFor="hello-language"
        style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}
      >
        Language
      </label>
      <select
        id="hello-language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: 6,
          fontSize: 13,
          padding: "4px 8px",
          background: "#ffffff",
          color: "#0f172a",
        }}
      >
        {Object.entries(GREETINGS).map(([code, { label }]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

