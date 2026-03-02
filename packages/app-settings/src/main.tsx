import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./bootstrap";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "settings-app-menubar": Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "settings-app-main": Record<string, any>;
    }
  }
}

function DevShell() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "44px 1fr",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        <settings-app-menubar style={{ display: "block", width: "100%" }} />
      </div>
      <div style={{ overflow: "auto" }}>
        <settings-app-main style={{ display: "block", height: "100%" }} />
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
