import * as React from "react";
import { Layout, Section, FullVideoPlayer, KorporusFederationPictogram } from "../components";
import { Board, type TaskDetailIssue } from "@korporus/site-ui";
import { getVideoById } from "../content/videos";
import { getVideoSrc, getVideosBaseUrl } from "../lib/getVideoSrc";

const DemoPage = () => {
  const boardColumns = ["backlog", "in_progress", "closed"];
  const boardIssues: TaskDetailIssue[] = [
    { id: "kor-51c8e1", title: "Runtime federated module loading into shell slots", type: "story", status: "in_progress", priority: 1 },
    { id: "kor-24505a", title: "React demo app on Amplify Gen2", type: "story", status: "closed", priority: 2 },
    { id: "kor-a81636", title: "Angular demo app on Amplify Gen2", type: "story", status: "closed", priority: 2 },
    { id: "kor-5ea317", title: "End-to-end smoke test", type: "task", status: "backlog", priority: 2 }
  ];

  const introVideo = getVideoById("intro") ?? null;
  const videosBaseUrl = getVideosBaseUrl();
  const canRenderVideo = Boolean(introVideo && videosBaseUrl);
  const introPoster = canRenderVideo && introVideo?.poster ? getVideoSrc(introVideo.poster) : undefined;
  const introSrc = canRenderVideo && introVideo ? getVideoSrc(introVideo.filename) : "";

  return (
    <Layout>
      <div className="space-y-12">
        <Section title="Frame-driven pictogram demo" subtitle="Reference implementation of a deterministic frame-compatible animation.">
          <div className="rounded-2xl bg-card p-4 min-h-[360px]">
            <KorporusFederationPictogram />
          </div>
        </Section>

        <Section title="Runtime board snapshot" subtitle="Representative milestones from the federated platform proof-of-concept." variant="alt">
          <div className="rounded-2xl bg-card p-4">
            <Board columns={boardColumns} issues={boardIssues} />
          </div>
        </Section>

        <Section title="Intro video draft" subtitle="Website media wiring remains intact while final video production is deferred.">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">{introVideo?.title ?? "Intro to Korporus"}</h3>
              <p className="text-muted leading-relaxed">{introVideo?.description}</p>
              <p className="text-xs text-muted/80 font-mono">GATSBY_VIDEOS_BASE_URL={videosBaseUrl ?? "(unset)"}</p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-card">
              <FullVideoPlayer src={introSrc} poster={introPoster} videoId="intro" />
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default DemoPage;
