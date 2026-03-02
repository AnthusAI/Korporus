import * as React from "react";
import { Layout, Section, Hero } from "../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";

const PhilosophyPage = () => {
  return (
    <Layout>
      <Hero
        title="Design Philosophy"
        subtitle="Korporus is designed to make powerful AI agent workflows feel approachable, visible, and easy to manage."
      />

      <div className="space-y-12">
        <Section
          title="Why this exists"
          subtitle="People need a practical way to run and supervise agents, not just another chat tab."
        >
          <Card className="p-8 bg-card">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-xl font-bold text-foreground">AI agents should be managed like apps and workers</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                As agents become more capable, more work happens asynchronously in the background. Most people do not need to know how those systems are built.
              </p>
              <p>
                They need a clear way to find the right app, run it, monitor it, adjust settings, and understand progress without learning low-level infrastructure.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Design principles" subtitle="The user-facing rules that guide every product decision." variant="alt">
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "1. Consistency over complexity",
                body: "Apps should feel familiar. Shared layout and interaction patterns reduce friction and make new workflows easier to adopt."
              },
              {
                title: "2. Visibility of background work",
                body: "If agents are running while you are away, progress and status must remain easy to inspect at a glance."
              },
              {
                title: "3. Control without technical overhead",
                body: "Settings and controls should be understandable to operators and teams who care about outcomes, not runtime internals."
              },
              {
                title: "4. Human-in-the-loop by default",
                body: "People remain responsible for guidance and oversight. The interface should make intervention, review, and escalation straightforward."
              },
              {
                title: "5. Simple defaults with room to grow",
                body: "A product should be easy for first-time users while still supporting more advanced workflows as teams mature."
              }
            ].map((card) => (
              <Card key={card.title} className="p-8 bg-card">
                <CardHeader className="p-0 mb-3">
                  <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                </CardHeader>
                <CardContent className="p-0 text-muted leading-relaxed">{card.body}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Day-to-day outcomes" subtitle="How this philosophy helps real teams running real work.">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Launch and manage apps quickly</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Open what you need, apply settings in a predictable place, and keep moving without re-learning each app from scratch.
              </CardContent>
            </Card>

            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Track progress with confidence</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Monitor long-running background work, understand what is blocked, and keep people aligned on what matters next.
              </CardContent>
            </Card>

            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Operate without noise</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Replace scattered logs and disconnected tools with a coherent operating surface that highlights the current state clearly.
              </CardContent>
            </Card>

            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Scale from confusion to control</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                As workloads grow, standardized app patterns help teams supervise more agent-driven processes without multiplying complexity.
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Need technical depth?" subtitle="Architecture and runtime principles are documented in the developer section.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 text-center">
              <p className="text-muted leading-relaxed mb-6">
                For implementation details like runtime contracts, manifest validation, host/remote boundaries, and deployment topology, use the developer track.
              </p>
              <a href="/developers" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
                Open Developers →
              </a>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
};

export default PhilosophyPage;
