import type { FeaturePictogramType } from "../components/FeaturePictogram";

export type DeveloperFeatureEntry = {
  title: string;
  description: string;
  href: string;
  docsHref?: string;
  pictogramType?: FeaturePictogramType;
};

export const DEVELOPER_FEATURE_ENTRIES: DeveloperFeatureEntry[] = [
  {
    title: "Shell Host Runtime",
    description: "An OS-like host discovers app manifests and mounts slot components at runtime.",
    href: "/features/core-management",
    docsHref: "/docs/architecture/shell",
    pictogramType: "core-management"
  },
  {
    title: "Module Federation Composition",
    description: "Remote bootstraps load over HTTP without build-time coupling to the host.",
    href: "/features/kanban-board",
    docsHref: "/docs/architecture/module-federation",
    pictogramType: "kanban-board"
  },
  {
    title: "Manifest Contract",
    description: "A strict manifest schema defines app identity, remote entry, and slot element names.",
    href: "/features/jira-sync",
    docsHref: "/docs/architecture/manifests",
    pictogramType: "jira-sync"
  },
  {
    title: "Web Component Slots",
    description: "Titlebar, main, and settings custom elements provide a framework-agnostic mount boundary.",
    href: "/features/local-tasks",
    docsHref: "/docs/architecture/web-components",
    pictogramType: "local-tasks"
  },
  {
    title: "Cross-Framework Hosts",
    description: "The same remote app renders in shell, React host, and Angular host implementations.",
    href: "/features/virtual-projects",
    docsHref: "/docs/guides/creating-an-app"
  },
  {
    title: "Shared State Model",
    description: "Slot components synchronize through lightweight app-level state stores.",
    href: "/features/beads-compatibility",
    docsHref: "/docs/guides/state-management",
    pictogramType: "beads-compatibility"
  },
  {
    title: "Integration Surfaces",
    description: "Editor-like shells and external containers can adopt the same manifest and slot contract.",
    href: "/features/vscode-plugin",
    docsHref: "/docs/guides/styling"
  },
  {
    title: "Docs Pipeline",
    description: "Repository markdown is mapped into website docs routes for publishable technical documentation.",
    href: "/features/integrated-wiki",
    docsHref: "/docs"
  },
  {
    title: "Procedure Runtime",
    description: "Build and evaluate programmable procedures with agent-assisted IDE workflows, DSL semantics, and secure execution boundaries.",
    href: "/developers#agent-procedure-studio",
    docsHref: "/developers#agent-procedure-studio"
  },
  {
    title: "Deployment Topology",
    description: "Amplify Gen2 hosts and App Runner runtime services are separated for independent rollout.",
    href: "/features/policy-as-code",
    docsHref: "/docs/guides/deployment"
  }
];
