import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./bootstrap";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "docs-app-titlebar": Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "docs-app-main": Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "docs-app-settings": Record<string, any>;
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
      <div style={{ gridColumn: "1 / -1" }}>
        <docs-app-titlebar style={{ display: "block", height: "100%" }} />
      </div>
      <div style={{ overflow: "auto" }}>
        <docs-app-main style={{ display: "block", height: "100%" }} />
      </div>
      <div style={{ borderLeft: "1px solid #e2e8f0", overflow: "auto" }}>
        <docs-app-settings style={{ display: "block", height: "100%" }} />
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
