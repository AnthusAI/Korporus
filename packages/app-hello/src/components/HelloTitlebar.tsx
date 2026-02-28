import { useHelloStore } from "../store";
import { GREETINGS } from "../data/greetings";

export function HelloTitlebar() {
  const language = useHelloStore((s) => s.language);
  const langInfo = GREETINGS[language] ?? GREETINGS["en"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "#1e293b",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontWeight: 700,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <span>Hello World</span>
      <span
        style={{
          background: "#22c55e",
          color: "#fff",
          borderRadius: "9999px",
          padding: "2px 10px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.03em",
        }}
      >
        {langInfo.label}
      </span>
    </div>
  );
}
