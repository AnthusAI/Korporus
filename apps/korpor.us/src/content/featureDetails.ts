export type FeatureSection = {
  title: string;
  subtitle: string;
  body: string[];
  alt?: boolean;
};

export type FeatureDetail = {
  slug: string;
  title: string;
  subtitle: string;
  docsHref: string;
  sections: FeatureSection[];
};

export const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  "core-management": {
    slug: "core-management",
    title: "Shell Host",
    subtitle: "An OS-like container that discovers app manifests and mounts remote slot components at runtime.",
    docsHref: "/docs/features/core-management",
    sections: [
      {
        title: "Layout Contract",
        subtitle: "A stable host surface for all remotes.",
        body: [
          "Korporus standardizes titlebar, main, and settings slots so every app remote can target a predictable host layout.",
          "The shell is intentionally thin: it handles discovery, loading, and mounting while app behavior lives in remotes."
        ]
      },
      {
        title: "Manifest-Driven",
        subtitle: "No hidden app registration.",
        alt: true,
        body: [
          "The shell reads manifests from known URLs and validates them before adding apps to the registry.",
          "This keeps onboarding explicit and makes runtime behavior inspectable from repository files."
        ]
      }
    ]
  },
  "kanban-board": {
    slug: "kanban-board",
    title: "Runtime Composition",
    subtitle: "Module Federation 2.0 imports each app bootstrap at runtime, preserving independent builds.",
    docsHref: "/docs/features/kanban-board",
    sections: [
      {
        title: "Decoupled Builds",
        subtitle: "Hosts and remotes evolve independently.",
        body: [
          "Each app publishes its own remote entry and bootstrap module.",
          "The shell consumes those remotes over HTTP at runtime without rebuilding against each app."
        ]
      },
      {
        title: "Deterministic Boot Flow",
        subtitle: "The host always follows the same loading pipeline.",
        alt: true,
        body: [
          "Registry selection resolves to remote metadata.",
          "The module loader imports bootstrap, which registers custom elements that the shell then mounts."
        ]
      }
    ]
  },
  "jira-sync": {
    slug: "jira-sync",
    title: "Manifest Discovery",
    subtitle: "A strict app manifest schema defines app identity, remote location, and slot element names.",
    docsHref: "/docs/features/jira-sync",
    sections: [
      {
        title: "Schema Validation",
        subtitle: "Fail fast on malformed remotes.",
        body: [
          "Manifests are validated against a shared schema package before apps become selectable.",
          "Invalid manifests never enter the runtime registry, reducing late-stage runtime failures."
        ]
      },
      {
        title: "Portable Metadata",
        subtitle: "The same contract works across multiple host apps.",
        alt: true,
        body: [
          "The manifest shape is host-agnostic and can be used by shell, React demo host, and Angular demo host.",
          "This keeps external integrations aligned to the same source-of-truth structure."
        ]
      }
    ]
  },
  "local-tasks": {
    slug: "local-tasks",
    title: "Slot Contract",
    subtitle: "Web Components provide a clean host/remote boundary for titlebar, main content, and settings.",
    docsHref: "/docs/features/local-tasks",
    sections: [
      {
        title: "Custom Element Boundary",
        subtitle: "Framework-independent rendering surface.",
        body: [
          "Remote bootstraps register custom elements with stable tag names.",
          "Hosts render those tags directly without importing remote framework internals."
        ]
      },
      {
        title: "Cross-Slot State",
        subtitle: "One app state, three mounted views.",
        alt: true,
        body: [
          "Because the three slot elements share a runtime context, app state can synchronize across views.",
          "This enables cohesive UX while preserving host-level isolation."
        ]
      }
    ]
  },
  "virtual-projects": {
    slug: "virtual-projects",
    title: "Cross-Framework Hosts",
    subtitle: "The same federated app runs in shell, React, and Angular hosts with no app-specific fork.",
    docsHref: "/docs/features/virtual-projects",
    sections: [
      {
        title: "Host-Agnostic Integration",
        subtitle: "One remote bundle, multiple host shells.",
        body: [
          "The POC validates embedding the same app in different frameworks through the same manifest + Web Component contract.",
          "This proves Korporus remotes are reusable beyond the native shell."
        ]
      },
      {
        title: "Operational Resilience",
        subtitle: "Cold start and loading states are host-level concerns.",
        alt: true,
        body: [
          "External hosts can present meaningful loading/error behavior while remotes initialize.",
          "That separation keeps app remotes focused on business UI logic."
        ]
      }
    ]
  },
  "beads-compatibility": {
    slug: "beads-compatibility",
    title: "Shared State",
    subtitle: "Simple store patterns keep slot components synchronized without coupling host and app internals.",
    docsHref: "/docs/features/beads-compatibility",
    sections: [
      {
        title: "State Ownership",
        subtitle: "Remotes own their own data model.",
        body: [
          "Each app remote can keep a single state store shared by titlebar/main/settings.",
          "Hosts only mount elements and do not need to understand app-specific state shape."
        ]
      },
      {
        title: "Composable UX",
        subtitle: "Local interactions propagate across mounted slots.",
        alt: true,
        body: [
          "Updating settings can immediately alter titlebar badges and main content output.",
          "This is essential for app experiences split across multiple host regions."
        ]
      }
    ]
  },
  "vscode-plugin": {
    slug: "vscode-plugin",
    title: "Editor Integration",
    subtitle: "Korporus architectural boundaries allow embedding in editor-like hosts and external shells.",
    docsHref: "/docs/features/vscode-plugin",
    sections: [
      {
        title: "Portable Contract",
        subtitle: "The same slot model scales to new host surfaces.",
        body: [
          "Because remotes expose custom elements, any compatible host can render them.",
          "This keeps integration effort centered on manifest loading and mount points."
        ]
      },
      {
        title: "Low Coupling",
        subtitle: "Host upgrades do not require app rebuilds.",
        alt: true,
        body: [
          "The runtime import boundary isolates deployment cycles between host and remotes.",
          "That improves velocity for teams shipping app features independently."
        ]
      }
    ]
  },
  "integrated-wiki": {
    slug: "integrated-wiki",
    title: "Docs Pipeline",
    subtitle: "Repository markdown and structured references can be presented as an integrated docs experience.",
    docsHref: "/docs/features/integrated-wiki",
    sections: [
      {
        title: "Repository as Source",
        subtitle: "Documentation stays in versioned project files.",
        body: [
          "The website ingests markdown content directly from the repo docs tree.",
          "This keeps public documentation aligned with the same authored content used by developers."
        ]
      },
      {
        title: "Structured Navigation",
        subtitle: "Docs routes mirror product architecture.",
        alt: true,
        body: [
          "Sectioned navigation maps to getting-started, architecture, guides, and reference materials.",
          "This layout matches the same information architecture users see in local project docs."
        ]
      }
    ]
  },
  "policy-as-code": {
    slug: "policy-as-code",
    title: "Deployment Topology",
    subtitle: "Korporus deploys remotes and hosts with clear runtime boundaries across App Runner and Amplify Gen2.",
    docsHref: "/docs/features/policy-as-code",
    sections: [
      {
        title: "Runtime Shape",
        subtitle: "App Runner serves remote assets and shell runtime.",
        body: [
          "The container deployment is optimized for runtime module loading and scale-to-zero behavior.",
          "Host apps resolve remote entries over HTTP without build-time bundling."
        ]
      },
      {
        title: "Static Host Delivery",
        subtitle: "Amplify Gen2 provides CDN-hosted entry points.",
        alt: true,
        body: [
          "React and Angular host apps deploy independently while consuming the same remote contract.",
          "This model separates static host release cadence from backend runtime rollout."
        ]
      }
    ]
  }
};
