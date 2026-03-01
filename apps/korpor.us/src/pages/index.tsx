import * as React from "react";
import { Layout, Section, Hero, FeaturePictogram, AnimatedPictogram, CodeUiSync, FullVideoPlayer } from "../components";
import { Board, TaskDetailPanel, type TaskDetailIssue } from "@korporus/site-ui";
import { FEATURE_ENTRIES } from "../content/features";
import { getVideoById } from "../content/videos";
import { getVideoSrc } from "../lib/getVideoSrc";

const BOARD_ISSUES: TaskDetailIssue[] = [
  {
    id: "kor-58e632",
    title: "Shell app scaffold with runtime slots",
    status: "in_progress",
    type: "story",
    priority: 1,
    description: "Introduces titlebar/main/settings host layout and runtime loading path."
  },
  {
    id: "kor-51c8e1",
    title: "Federated module loading in shell",
    status: "backlog",
    type: "story",
    priority: 1,
    description: "Loads remote bootstrap modules and mounts custom elements."
  },
  {
    id: "kor-a81636",
    title: "Angular host application on Amplify",
    status: "closed",
    type: "story",
    priority: 2,
    description: "Validates framework-agnostic embedding with custom elements."
  },
  {
    id: "kor-24505a",
    title: "React host application on Amplify",
    status: "closed",
    type: "story",
    priority: 2,
    description: "Shows runtime remote loading from static host shell."
  }
];

const IndexPage = () => {
  const columns = ["backlog", "in_progress", "closed"];
  const [issues, setIssues] = React.useState<TaskDetailIssue[]>(BOARD_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let step = 0;
    const timer = window.setInterval(() => {
      setIssues((current) => {
        const next = [...current];
        const shellIdx = next.findIndex((issue) => issue.id === "kor-51c8e1");
        if (shellIdx >= 0) {
          const status = step % 3 === 0 ? "backlog" : step % 3 === 1 ? "in_progress" : "closed";
          next[shellIdx] = { ...next[shellIdx], status };
        }
        return next;
      });
      step += 1;
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) ?? null;

  const introVideo = getVideoById("intro");
  const introPoster = introVideo?.poster ? getVideoSrc(introVideo.poster) : undefined;
  const introSrc = introVideo ? getVideoSrc(introVideo.filename) : "";

  return (
    <Layout>
      <Hero
        title="Federated web apps, loaded at runtime"
        subtitle="Korporus is a shell-first platform for independently-built applications connected by a strict manifest and Web Component contract."
        rightPane={<CodeUiSync />}
        actions={
          <>
            <a href="/getting-started" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
              Get Started
            </a>
            <a href="/docs" className="text-sm font-semibold leading-6 text-foreground hover:text-selected transition-all">
              Read the Docs <span aria-hidden="true">→</span>
            </a>
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center pb-24">
        <p className="text-xl leading-8 text-muted font-medium">
          The shell discovers manifests, imports remote bootstrap modules, and mounts titlebar/main/settings slot elements.
          The same remote app can also run in independent React and Angular host applications.
        </p>
      </div>

      <Section
        title="Frame-driven federation pictogram"
        subtitle="A deterministic animation model driven by frame number, compatible with future VideoML workflows."
      >
        <div className="w-full max-w-5xl mx-auto h-auto">
          <AnimatedPictogram />
        </div>
      </Section>

      <Section title="Runtime board snapshot" subtitle="Core Korporus milestones represented in the same card-and-column visual language." variant="alt">
        <div className="kanban-snapshot-container h-auto">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <Board columns={columns} issues={issues} onSelectIssue={(issue) => setSelectedIssueId(issue.id)} selectedIssueId={selectedIssueId} />
            <TaskDetailPanel task={selectedIssue} isOpen={Boolean(selectedIssue)} onClose={() => setSelectedIssueId(null)} />
          </div>
        </div>
      </Section>

      <Section title="Intro video draft" subtitle="The media pipeline is preserved, while final video production remains a separate scope.">
        <div className="w-full flex justify-center">
          <FullVideoPlayer src={introSrc} poster={introPoster} videoId="intro" />
        </div>
      </Section>

      <Section title="Features" subtitle="A full set of Korporus capabilities organized into the same interaction pattern used across this site." variant="alt">
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURE_ENTRIES.map((feature) => {
            const videoId = feature.href.split("/").pop() || "";
            return (
              <a key={feature.href} href={feature.href} className="group block h-full">
                <div className="bg-card rounded-2xl p-6 md:p-8 h-full flex flex-col transition-all duration-300 group-hover:bg-card-muted/50 group-hover:shadow-lg">
                  <div className="relative aspect-video flex items-center justify-center overflow-hidden mb-8 rounded-xl bg-background">
                    <FeaturePictogram type={videoId} className="w-full h-full min-h-0" style={{ minHeight: "100%", borderRadius: 0 }} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-selected transition-colors flex items-center gap-2">
                      {feature.title}
                      <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">→</span>
                    </h3>
                    <p className="text-muted leading-relaxed flex-1">{feature.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </Section>

      <Section title="Why Korporus" subtitle="A practical architecture for independently shipped web applications.">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Independent Delivery</h3>
            <p className="text-muted">Remotes and hosts release on separate cadences with runtime contract validation.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Framework Agnostic</h3>
            <p className="text-muted">The Web Component boundary allows the same app remote to render in different host frameworks.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Cloud-Ready</h3>
            <p className="text-muted">App Runner and Amplify Gen2 topology supports static host delivery with dynamic remote loading.</p>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default IndexPage;
