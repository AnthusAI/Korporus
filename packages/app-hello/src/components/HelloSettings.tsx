import { useHelloStore } from "../store";
import { GREETINGS } from "../data/greetings";

export function HelloSettings() {
  const language = useHelloStore((s) => s.language);
  const setLanguage = useHelloStore((s) => s.setLanguage);

  return (
    <div
      style={{
        padding: "20px 16px",
        background: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Language
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Object.entries(GREETINGS).map(([code, { label }]) => {
          const isSelected = language === code;
          return (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: isSelected ? "#1e293b" : "#fff",
                color: isSelected ? "#f8fafc" : "#1e293b",
                border: isSelected ? "2px solid #1e293b" : "2px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 400,
                textAlign: "left",
                transition: "all 0.15s ease",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: isSelected ? "4px solid #22c55e" : "2px solid #94a3b8",
                  background: isSelected ? "#1e293b" : "#fff",
                  flexShrink: 0,
                }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
