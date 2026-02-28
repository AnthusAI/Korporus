import { useHelloStore } from "../store";
import { GREETINGS } from "../data/greetings";

export function HelloMain() {
  const language = useHelloStore((s) => s.language);
  const langInfo = GREETINGS[language] ?? GREETINGS["en"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 700,
          color: "#1e293b",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {langInfo.greeting}
      </p>
    </div>
  );
}
