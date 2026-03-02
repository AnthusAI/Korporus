import * as React from "react";
import { KorporusFederationPictogram } from "./KorporusFederationPictogram";

export type FeaturePictogramType =
  | "core-management"
  | "kanban-board"
  | "jira-sync"
  | "local-tasks"
  | "beads-compatibility"
  | "virtual-projects"
  | "vscode-plugin"
  | "integrated-wiki"
  | "policy-as-code";

const LABELS: Record<FeaturePictogramType, string> = {
  "core-management": "Shell Host",
  "kanban-board": "Runtime Composition",
  "jira-sync": "Manifest Discovery",
  "local-tasks": "Slot Contract",
  "beads-compatibility": "Shared State",
  "virtual-projects": "Framework-Agnostic",
  "vscode-plugin": "Editor Integration",
  "integrated-wiki": "Docs Pipeline",
  "policy-as-code": "Deployment"
};

export function FeaturePictogram({
  type,
  style,
  className
}: {
  type: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const label = LABELS[type as FeaturePictogramType] ?? "Korporus";
  return (
    <div className={`relative w-full h-full ${className ?? ""}`} style={style}>
      <KorporusFederationPictogram className="w-full h-full" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-background/75 px-2 py-1 text-[10px] font-mono tracking-widest text-muted uppercase border border-border/50">
        {label}
      </div>
    </div>
  );
}
