export type FeatureEntry = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
};

export const FEATURE_ENTRIES: FeatureEntry[] = [
  {
    title: "Shell Host",
    description: "An OS-like host application that discovers manifests and mounts slot-based app views at runtime.",
    href: "/features/core-management"
  },
  {
    title: "Runtime Composition",
    description: "Module Federation 2.0 wiring that loads remote bootstrap modules without build-time coupling.",
    href: "/features/kanban-board"
  },
  {
    title: "Manifest Discovery",
    description: "A strict JSON manifest contract for app metadata, remote entries, and slot element names.",
    href: "/features/jira-sync"
  },
  {
    title: "Slot Contract",
    description: "A predictable titlebar/main/settings Web Component model shared across all Korporus apps.",
    href: "/features/local-tasks"
  },
  {
    title: "Cross-Framework Hosts",
    description: "The same remote app runs inside the shell, React demo host, and Angular demo host.",
    href: "/features/virtual-projects"
  },
  {
    title: "Shared State",
    description: "Cross-slot behavior through lightweight in-app stores so titlebar/main/settings stay synchronized.",
    href: "/features/beads-compatibility"
  },
  {
    title: "Editor Integration",
    description: "The architecture is designed so third-party shells and tools can embed the same app contract.",
    href: "/features/vscode-plugin"
  },
  {
    title: "Docs Pipeline",
    description: "Repository markdown and API references can be surfaced as a federated docs experience.",
    href: "/features/integrated-wiki"
  },
  {
    title: "Deployment Topology",
    description: "App Runner for runtime remotes, Amplify Gen2 for static hosts, and explicit environment contracts.",
    href: "/features/policy-as-code",
    eyebrow: "New"
  }
];
