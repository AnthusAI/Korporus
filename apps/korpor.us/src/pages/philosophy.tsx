import * as React from "react";
import { Layout, Section, Hero } from "../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";

const PhilosophyPage = () => {
  return (
    <Layout>
      <Hero
        title="Design Philosophy"
        subtitle="Korporus prioritizes explicit runtime contracts, independent delivery, and host/remote isolation."
      />

      <div className="space-y-12">
        <Section title="Why Korporus Exists" subtitle="Composable frontend systems need first-class architecture, not ad hoc glue code.">
          <Card className="p-8 bg-card">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-xl font-bold text-foreground">Runtime Boundaries First</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                Korporus starts from runtime concerns: who owns the host shell, who owns app remotes, and what contract governs the edge between them.
              </p>
              <p>
                By making that contract explicit, the platform avoids hidden assumptions that usually accumulate in large frontend systems.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Core Principles" subtitle="The rules that shape implementation choices." variant="alt">
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "1. Contract over Convention",
                body: "Manifests and schema validation define integration points so host and remote teams can move independently without guessing each other’s internals."
              },
              {
                title: "2. Runtime Composition",
                body: "Module Federation bootstrap loading happens at runtime, enabling independent build and deployment pipelines for remotes."
              },
              {
                title: "3. Framework-Agnostic Boundary",
                body: "Web Components provide a stable host interface and prevent app internals from leaking into host implementation details."
              },
              {
                title: "4. Explicit Failure Modes",
                body: "Validation and loading steps are deterministic so operational issues surface early and can be attributed to a specific boundary."
              },
              {
                title: "5. Deployability",
                body: "Static host delivery and remote runtime infrastructure are separated to reduce deployment coupling and improve iteration speed."
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

        <Section title="Operational Intent" subtitle="What this philosophy means day-to-day.">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Independent Ownership</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Teams ship app remotes in isolation while host teams evolve shell UX and loading behavior independently.
              </CardContent>
            </Card>
            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Predictable Integration</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Every integration path is inspectable from repository files: manifests, schema package, and runtime loader code.
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default PhilosophyPage;
