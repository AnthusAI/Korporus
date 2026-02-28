import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import bootstrap to register all custom elements as a side effect
import "./bootstrap";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "hello-app-titlebar": Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "hello-app-main": Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "hello-app-settings": Record<string, any>;
    }
  }
}

function DevShell() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "56px 1fr",
        gridTemplateColumns: "1fr 240px",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Titlebar spans full width */}
      <div style={{ gridColumn: "1 / -1" }}>
        <hello-app-titlebar style={{ display: "block", height: "100%" }} />
      </div>

      {/* Main content area */}
      <div style={{ overflow: "auto" }}>
        <hello-app-main style={{ display: "block", height: "100%" }} />
      </div>

      {/* Settings sidebar */}
      <div
        style={{
          borderLeft: "1px solid #e2e8f0",
          overflow: "auto",
        }}
      >
        <hello-app-settings style={{ display: "block", height: "100%" }} />
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <DevShell />
    </StrictMode>,
  );
}
