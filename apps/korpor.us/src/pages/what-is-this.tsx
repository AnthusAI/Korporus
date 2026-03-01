import * as React from "react";
import { Layout, Section, Hero, FeaturePictogram } from "../components";
import { Card, CardContent } from "@korporus/site-ui";

const WhatIsThisPage = () => {
  return (
    <Layout>
      <Hero
        eyebrow="Start Here"
        title="What Is This?"
        subtitle="Korporus is a federated application platform where a shell host loads independently-built app remotes at runtime."
        actions={
          <>
            <a href="/getting-started" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              Getting Started
            </a>
            <a href="/features" className="text-sm font-semibold leading-6 text-foreground hover:text-selected transition-all">
              See Features <span aria-hidden="true">-&gt;</span>
            </a>
          </>
        }
      />

      <div className="space-y-12">
        <Section title="Why this exists" subtitle="Modern teams need independently deployable frontend systems without brittle integration coupling.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                Monolithic frontend deployment creates bottlenecks: one release pipeline, one runtime, and one failure domain.
              </p>
              <p>
                Korporus formalizes a host/remote boundary so apps can be developed, versioned, and deployed independently.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="In plain English" subtitle="A shell that loads app modules on demand." variant="alt">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                Each app publishes a manifest and a remote entry. The shell reads the manifest, loads bootstrap code, and mounts app Web Components into standard slots.
              </p>
              <p>
                The same remote can run inside other host applications, including the React and Angular demos in this repository.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Contract-first integration" subtitle="Schema validation and stable slot names keep host and remote aligned.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 grid gap-8 md:grid-cols-2 items-center text-muted leading-relaxed">
              <div className="space-y-4">
                <p>
                  The app manifest schema defines identity, remote entry URL, and slot element tags. Hosts validate before loading.
                </p>
                <p>
                  That gives teams a reliable integration contract and clear failure boundaries when remotes drift.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[360px] aspect-[5/3] rounded-xl bg-card-muted border border-border/60 p-4">
                  <FeaturePictogram type="jira-sync" className="w-full h-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="What it's good at" subtitle="Clear ownership, composable runtime behavior, and framework-agnostic embedding.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 text-muted leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>Independent app release cycles with runtime composition</li>
                <li>Manifest-driven discovery and strict schema validation</li>
                <li>Reusing the same app in multiple host frameworks</li>
                <li>Preserving app-level state across titlebar/main/settings slots</li>
                <li>Deploying static hosts separately from remote runtime infrastructure</li>
              </ul>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
};

export default WhatIsThisPage;
