export type FeatureEntry = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
};

// Main site features: user-facing outcomes and day-to-day product value.
export const FEATURE_ENTRIES: FeatureEntry[] = [
  {
    title: "One Home for Every App",
    description: "Launch your workspace from a single starting point instead of juggling multiple tabs and URLs.",
    href: "/features#one-home"
  },
  {
    title: "Monitor Background Agents with Kanban",
    description: "Track long-running agent work in a shared board so status, blockers, and progress stay visible at a glance.",
    href: "/features#workflow-process-monitoring"
  },
  {
    title: "Consistent Controls",
    description: "Every app follows the same titlebar, main view, and settings pattern so the product feels familiar.",
    href: "/features#consistent-controls"
  },
  {
    title: "Focused Settings Panel",
    description: "Adjust app behavior from a dedicated sidebar without losing your place in the main workflow.",
    href: "/features#settings-sidebar"
  },
  {
    title: "Fast, Responsive Views",
    description: "UI regions update smoothly as you switch apps and settings, keeping interactions immediate.",
    href: "/features#responsive-views"
  },
  {
    title: "Clear Visual Language",
    description: "Shared motion, spacing, and panel behavior help teams understand what is happening at a glance.",
    href: "/features#visual-language"
  },
  {
    title: "Open in One Click",
    description: "Jump straight into the app you need from the home screen with clear icon-based navigation.",
    href: "/features#one-click"
  },
  {
    title: "Agent Procedure Studio",
    description: "A first-class environment for designing, running, and supervising agent procedures with secure sandboxed execution.",
    href: "/features#agent-procedure-studio"
  },
  {
    title: "Reliable Cloud Delivery",
    description: "Deploy predictable experiences so users get stable loading behavior and dependable app access.",
    href: "/features#reliable-delivery"
  },
  {
    title: "Developer Platform Included",
    description: "Behind the scenes, Korporus has a full technical platform when your team is ready to extend it.",
    href: "/developers",
    eyebrow: "For Teams"
  }
];
