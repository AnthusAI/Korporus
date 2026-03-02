import * as React from "react";
import {
  Layout,
  Section,
  Hero,
  FullVideoPlayer,
  ShellHomePreview,
  AgentAppsPictogram,
  CopilotArtifactsPictogram,
  KanbanBusPictogram
} from "../components";
import { Board, TaskDetailPanel, type TaskDetailIssue } from "@korporus/site-ui";
import { FEATURE_ENTRIES } from "../content/features";
import { getVideoById } from "../content/videos";
import { getVideoSrc } from "../lib/getVideoSrc";
import { useInView } from "framer-motion";

const BOARD_CONFIG = {
  statuses: [
    { key: "backlog", name: "Backlog", category: "To do" },
    { key: "in_progress", name: "In Progress", category: "In progress" },
    { key: "closed", name: "Done", category: "Done" }
  ],
  categories: [
    { name: "To do", color: "grey" },
    { name: "In progress", color: "blue" },
    { name: "Done", color: "green" }
  ],
  priorities: {
    1: { name: "high", color: "bright_red" },
    2: { name: "medium", color: "yellow" },
    3: { name: "low", color: "blue" }
  },
  type_colors: {
    epic: "magenta",
    task: "blue",
    bug: "red",
    story: "yellow",
    chore: "green",
    "sub-task": "violet"
  }
};

const BOARD_COLUMNS = BOARD_CONFIG.statuses.map((status) => status.key);

const PRIORITY_LOOKUP = {
  1: "high",
  2: "medium",
  3: "low"
};

const BOARD_ISSUES: TaskDetailIssue[] = [
  {
    id: "kor-101",
    title: "Roll out unified app launcher surface",
    status: "backlog",
    type: "story",
    priority: 2,
    description: "Give users one predictable place to find, open, and return to agent apps."
  },
  {
    id: "kor-102",
    title: "Agent runner posts background progress updates",
    status: "backlog",
    type: "story",
    priority: 1,
    description: "Agents keep working off-screen and publish status changes without manual refresh."
  },
  {
    id: "kor-103",
    title: "Escalate blocked jobs to human owner",
    status: "in_progress",
    type: "story",
    priority: 2,
    description: "Surface blockers immediately so stalled automation gets human intervention fast."
  },
  {
    id: "kor-104",
    title: "Roll app-level boards into system overview",
    status: "closed",
    type: "story",
    priority: 2,
    description: "See what is happening across your full workspace, not just one app."
  },
  {
    id: "kor-105",
    title: "Add agent resource health checks",
    status: "closed",
    type: "task",
    priority: 3,
    description: "Track container health and restart conditions in one operations-friendly flow."
  }
];

const FeatureVisual = ({ index }: { index: number }) => {
  if (index === 1) {
    return (
      <div className="mb-6 rounded-xl border border-border/50 bg-background p-2">
        <KanbanBusPictogram />
      </div>
    );
  }

  const palette = [
    "bg-card-muted/70",
    "bg-card-muted/60",
    "bg-card-muted/55",
    "bg-card-muted/50"
  ];
  const accent = ["w-1/2", "w-2/3", "w-3/4", "w-5/6"];

  return (
    <div className="mb-6 rounded-xl border border-border/50 bg-background p-4">
      <p className="text-xs font-mono uppercase tracking-widest text-muted">Feature {String(index + 1).padStart(2, "0")}</p>
      <div className="mt-3 space-y-2">
        <div className={`h-3 rounded ${palette[index % palette.length]} border border-border/40`} />
        <div className={`h-3 rounded ${palette[(index + 1) % palette.length]} border border-border/40 ${accent[index % accent.length]}`} />
        <div className={`h-3 rounded ${palette[(index + 2) % palette.length]} border border-border/40 ${accent[(index + 1) % accent.length]}`} />
      </div>
    </div>
  );
};

const IndexPage = () => {
  const [issues, setIssues] = React.useState<TaskDetailIssue[]>(BOARD_ISSUES);
  const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(new Set());
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null);
  const [focusedIssueId, setFocusedIssueId] = React.useState<string | null>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const boardSectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(boardSectionRef, { margin: "-200px" });

  React.useEffect(() => {
    if (!isInView) {
      return;
    }

    let moveCount = 0;
    const interval = window.setInterval(() => {
      setIssues((current) => {
        const next = [...current];
        const step = moveCount % 4;

        if (step === 0) {
          return BOARD_ISSUES;
        }

        if (step === 1) {
          const idx = next.findIndex((issue) => issue.id === "kor-102");
          if (idx >= 0) {
            next[idx] = { ...next[idx], status: "in_progress" };
          }
        } else if (step === 2) {
          const idx = next.findIndex((issue) => issue.id === "kor-103");
          if (idx >= 0) {
            next[idx] = { ...next[idx], status: "closed" };
          }
        } else if (step === 3) {
          const idx = next.findIndex((issue) => issue.id === "kor-101");
          if (idx >= 0) {
            next[idx] = { ...next[idx], status: "in_progress" };
          }
        }

        return next;
      });
      moveCount += 1;
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isInView]);

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) ?? null;

  const toggleColumn = (column: string) => {
    setCollapsedColumns((current) => {
      const next = new Set(current);
      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  };

  const handleSelectIssue = (issue: TaskDetailIssue) => {
    setSelectedIssueId((current) => (current === issue.id ? null : issue.id));
  };

  const handleFocusIssue = (issueId: string) => {
    setFocusedIssueId((current) => (current === issueId ? null : issueId));
  };

  const introVideo = getVideoById("intro");
  const introPoster = introVideo?.poster ? getVideoSrc(introVideo.poster) : undefined;
  const introSrc = introVideo ? getVideoSrc(introVideo.filename) : "";

  return (
    <Layout>
      <Hero
        title="A new OS for a new kind of app"
        subtitle="Run AI agents like apps: one place to launch them, monitor long-running background work, and manage settings and progress in a consistent interface."
        rightPane={<ShellHomePreview scale={0.4} className="max-w-full" />}
        actions={
          <>
            <a href="/demo" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
              Open Demo
            </a>
            <a href="/developers" className="text-sm font-semibold leading-6 text-foreground hover:text-selected transition-all">
              Developers <span aria-hidden="true">→</span>
            </a>
          </>
        }
      />

      <Section
        title="Your agent workspace works like an operating system"
        subtitle="Find apps, open them quickly, and use familiar layout patterns so you always know where controls and settings live."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Korporus is built for people who need outcomes, not infrastructure details. You get a simple home for launching agent apps and returning to them later.
            </p>
            <p>
              Each app follows the same basic interaction model, so once you learn one, the rest feel familiar.
            </p>
          </div>
          <AgentAppsPictogram className="h-full" />
        </div>
      </Section>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-2">
        <div className="w-full flex justify-center">
          <FullVideoPlayer src={introSrc} poster={introPoster} videoId="intro" />
        </div>
      </div>

      <Section
        title="Monitor background work without digging through logs"
        subtitle="Asynchronous agents keep working while you do other things. Use shared boards to track status, blockers, and ownership at a glance."
        variant="alt"
      >
        <div className="space-y-6">
          <div className="kanban-snapshot-container h-[550px]" ref={boardSectionRef}>
            <div className={`layout-frame gap-4 ${isMaximized ? "detail-maximized" : ""} flex flex-col lg:flex-row`}>
              <div className="layout-slot layout-slot-board">
                <Board
                  columns={BOARD_COLUMNS}
                  issues={issues}
                  priorityLookup={PRIORITY_LOOKUP}
                  config={BOARD_CONFIG}
                  onSelectIssue={handleSelectIssue}
                  selectedIssueId={selectedIssueId}
                  collapsedColumns={collapsedColumns}
                  onToggleCollapse={toggleColumn}
                  detailOpen={Boolean(selectedIssueId)}
                />
              </div>
              <TaskDetailPanel
                task={selectedIssue}
                allIssues={issues}
                columns={BOARD_COLUMNS}
                priorityLookup={PRIORITY_LOOKUP}
                config={BOARD_CONFIG}
                apiBase=""
                isOpen={Boolean(selectedIssue)}
                isVisible={Boolean(selectedIssue)}
                navDirection="none"
                widthPercent={42}
                layout="auto"
                onClose={() => setSelectedIssueId(null)}
                onToggleMaximize={() => setIsMaximized((prev) => !prev)}
                isMaximized={isMaximized}
                onAfterClose={() => undefined}
                onFocus={handleFocusIssue}
                focusedIssueId={focusedIssueId}
                onNavigateToDescendant={handleSelectIssue}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6 text-muted leading-relaxed">
            <h3 className="text-lg font-semibold text-foreground mb-3">Realtime board, shared status</h3>
            <p>Think of this like managing a team: you need to know what is in progress, what is blocked, and what finished.</p>
            <p className="mt-3">Korporus keeps this view live so you can monitor asynchronous agent work without digging through logs.</p>
          </div>
        </div>
      </Section>

      <Section
        title="Create things with copilot-style apps and artifacts"
        subtitle="Many apps pair a copilot with an artifact view so you can guide the agent while it builds real outputs."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Artifact + copilot is a common pattern</h3>
              <p className="text-muted leading-relaxed">
                Use an app to produce deliverables like decks, docs, plans, and reports, while a side copilot helps you steer quality and intent.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Flexible app interfaces</h3>
              <p className="text-muted leading-relaxed">
                Not every app needs the same view. Boards are broadly useful, but apps can also expose specialized representations that fit their job.
              </p>
            </div>
          </div>
          <CopilotArtifactsPictogram className="h-full" />
        </div>
      </Section>

      <Section title="Features" variant="alt">
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURE_ENTRIES.map((feature, index) => (
            <a key={feature.href} href={feature.href} className="group block h-full">
              <div className="bg-card rounded-2xl p-6 md:p-8 h-full flex flex-col transition-all duration-300 group-hover:bg-card-muted/50 group-hover:shadow-lg">
                <FeatureVisual index={index} />
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-selected transition-colors flex items-center gap-2">
                    {feature.title}
                    <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">→</span>
                  </h3>
                  <p className="text-muted leading-relaxed flex-1">{feature.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section title="For Developers" subtitle="Technical architecture, contracts, and runtime details live in a dedicated developer section.">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-2">Keep product UX simple, keep technical depth accessible</h3>
            <p className="text-muted leading-relaxed">
              The developer area documents runtime loading, manifest contracts, security boundaries, and deployment models for teams integrating or extending the platform.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6 flex flex-col justify-between">
            <p className="text-muted text-sm mb-4">Go deeper when you need implementation and architecture details.</p>
            <a href="/developers" className="cta-button px-5 py-2 text-sm text-center">Open Developer Section →</a>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default IndexPage;
