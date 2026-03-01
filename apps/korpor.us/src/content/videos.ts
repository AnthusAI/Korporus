export type VideoEntry = {
  id: string;
  title: string;
  description: string;
  filename: string;
  poster?: string;
};

export const VIDEOS: VideoEntry[] = [
  {
    id: "intro",
    title: "Intro to Korporus",
    description: "Draft placeholder for the Korporus website intro video. Final production is intentionally out of scope for this implementation.",
    filename: "korporus-intro.mp4",
    poster: "korporus-intro.jpg"
  },
  {
    id: "core-management",
    title: "Shell Host",
    description: "How the shell discovers manifests and mounts app slot components.",
    filename: "shell-host.mp4",
    poster: "shell-host.jpg"
  },
  {
    id: "kanban-board",
    title: "Runtime Composition",
    description: "Runtime remote bootstrap loading via Module Federation.",
    filename: "runtime-composition.mp4",
    poster: "runtime-composition.jpg"
  },
  {
    id: "jira-sync",
    title: "Manifest Discovery",
    description: "How app manifests define remote entries and slot tags.",
    filename: "manifest-discovery.mp4",
    poster: "manifest-discovery.jpg"
  },
  {
    id: "local-tasks",
    title: "Slot Contract",
    description: "Titlebar/main/settings composition boundaries.",
    filename: "slot-contract.mp4",
    poster: "slot-contract.jpg"
  },
  {
    id: "virtual-projects",
    title: "Cross-Framework Hosts",
    description: "React and Angular host apps rendering the same remote bundle.",
    filename: "cross-framework-hosts.mp4",
    poster: "cross-framework-hosts.jpg"
  },
  {
    id: "beads-compatibility",
    title: "Shared State",
    description: "Cross-slot synchronization patterns for federated apps.",
    filename: "shared-state.mp4",
    poster: "shared-state.jpg"
  },
  {
    id: "vscode-plugin",
    title: "Editor Integration",
    description: "Embedding Korporus-style remotes in external host shells.",
    filename: "editor-integration.mp4",
    poster: "editor-integration.jpg"
  },
  {
    id: "integrated-wiki",
    title: "Documentation Pipeline",
    description: "Markdown-driven docs publishing flow backed by repository content.",
    filename: "documentation-pipeline.mp4",
    poster: "documentation-pipeline.jpg"
  },
  {
    id: "policy-as-code",
    title: "Deployment Topology",
    description: "App Runner + Amplify Gen2 deployment model and runtime contracts.",
    filename: "deployment-topology.mp4",
    poster: "deployment-topology.jpg"
  }
];

export const getVideoById = (id: string): VideoEntry | undefined => VIDEOS.find((video) => video.id === id);
