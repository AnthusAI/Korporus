import { GREETINGS } from "../data/greetings";
import { useHelloStore } from "../store";

export function HelloSettings() {
  const language = useHelloStore((s) => s.language);
  const setLanguage = useHelloStore((s) => s.setLanguage);

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "32px auto",
        padding: 20,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>Hello Settings</h2>
      <p style={{ margin: "8px 0 16px", fontSize: 14, color: "#64748b" }}>
        Choose the default greeting language for this app.
      </p>

      <label
        htmlFor="hello-settings-language"
        style={{
          display: "block",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#64748b",
          marginBottom: 6,
        }}
      >
        Language
      </label>
      <select
        id="hello-settings-language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          width: "100%",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          padding: "8px 10px",
          fontSize: 14,
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
