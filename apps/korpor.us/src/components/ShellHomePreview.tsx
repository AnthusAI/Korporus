import * as React from "react";

type ShellPreviewApp = {
  id: string;
  name: string;
  badge: string;
};

const SHELL_APPS: ShellPreviewApp[] = [
  { id: "hello", name: "Hello", badge: "H" },
  { id: "docs", name: "Docs", badge: "D" },
  { id: "workflow", name: "Workflow", badge: "W" },
  { id: "analytics", name: "Analytics", badge: "A" },
  { id: "ops", name: "Ops", badge: "O" },
  { id: "admin", name: "Admin", badge: "M" }
];

type ShellHomePreviewProps = {
  scale?: number;
  activeAppId?: string;
  className?: string;
};

const BASE_WIDTH = 920;
const BASE_HEIGHT = 620;

export function ShellHomePreview({ scale = 1, activeAppId, className }: ShellHomePreviewProps) {
  const activeId = activeAppId ?? "docs";
  const scaledWidth = BASE_WIDTH * scale;
  const scaledHeight = BASE_HEIGHT * scale;

  return (
    <div
      className={`relative rounded-2xl border border-border/60 shadow-2xl overflow-hidden bg-[#0b0f17] ${className ?? ""}`}
      style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
      aria-label="Korporus shell home screen preview"
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        }}
      >
        <header className="h-14 px-5 bg-[#111827] border-b border-white/10 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight">Korporus</span>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/70">Home</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <button type="button" aria-label="Home" className="p-1.5 rounded-md bg-white/10 text-white">
              <span className="text-xs">H</span>
            </button>
            <button type="button" aria-label="Search" className="p-1.5 rounded-md hover:bg-white/10">
              <span className="text-xs">S</span>
            </button>
            <button type="button" aria-label="Notifications" className="p-1.5 rounded-md hover:bg-white/10">
              <span className="text-xs">N</span>
            </button>
            <button type="button" aria-label="Settings" className="p-1.5 rounded-md hover:bg-white/10">
              <span className="text-xs">⚙</span>
            </button>
          </div>
        </header>

        <main className="h-[566px] bg-[#f8fafc] p-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold text-slate-800 mb-10">Your Apps</h2>
            <div className="grid grid-cols-6 gap-7">
              {SHELL_APPS.map((app) => {
                const active = app.id === activeId;
                return (
                  <div key={app.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-20 h-20 rounded-3xl shadow-md border flex items-center justify-center text-lg font-bold transition-all ${
                        active
                          ? "bg-[#0ea5e9] text-white border-[#0ea5e9] scale-105 shadow-lg"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {app.badge}
                    </div>
                    <span className={`text-xs font-medium ${active ? "text-slate-900" : "text-slate-600"}`}>{app.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 py-5">
              <p className="text-sm text-slate-500 font-mono uppercase tracking-wider mb-2">Home Workspace</p>
              <p className="text-slate-700">
                Start from one shell and open any app with the same predictable interaction model.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
