import * as React from "react";
import { Layout, Section, Hero, FeaturePictogram, CodeBlock } from "../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";
import { DEVELOPER_FEATURE_ENTRIES } from "../content/developerFeatures";
import type { FeaturePictogramType } from "../components/FeaturePictogram";

const DeveloperFeatureCard = ({
  title,
  description,
  href,
  docsHref,
  pictogramType
}: {
  title: string;
  description: string;
  href: string;
  docsHref?: string;
  pictogramType?: FeaturePictogramType;
}) => (
  <Card className="h-full p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="grid gap-6 md:grid-cols-[132px_1fr] md:items-center">
      <div className="w-full h-[96px] rounded-xl border border-border/60 bg-card-muted/40 overflow-hidden">
        {pictogramType ? (
          <FeaturePictogram type={pictogramType} className="w-full h-full" />
        ) : (
          <div className="h-full p-4 flex flex-col justify-center gap-2">
            <div className="h-2 rounded bg-card-muted border border-border/30" />
            <div className="h-2 rounded bg-card-muted border border-border/30 w-4/5" />
            <div className="h-2 rounded bg-card-muted border border-border/30 w-2/3" />
          </div>
        )}
      </div>
      <div className="space-y-3">
        <CardHeader className="p-0">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </CardHeader>
        <CardContent className="p-0 text-muted leading-relaxed">{description}</CardContent>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <a href={href} className="text-sm font-semibold text-foreground hover:text-selected transition-colors">
            Feature Detail <span aria-hidden="true">→</span>
          </a>
          {docsHref ? (
            <a href={docsHref} className="text-sm font-semibold text-muted hover:text-selected transition-colors">
              Docs <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  </Card>
);

const DevelopersPage = () => {
  return (
    <Layout>
      <Hero
        eyebrow="Developers"
        title="Korporus Developer Platform"
        subtitle="Everything technical lives here: runtime composition, manifest contracts, slot boundaries, and deployment topology."
        actions={
          <>
            <a href="/docs/getting-started" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
              Getting Started
            </a>
            <a href="/docs" className="text-sm font-semibold leading-6 text-foreground hover:text-selected transition-all">
              Documentation <span aria-hidden="true">→</span>
            </a>
            <a href="/demo" className="text-sm font-semibold leading-6 text-foreground hover:text-selected transition-all">
              Demo <span aria-hidden="true">→</span>
            </a>
          </>
        }
      />

      <div className="space-y-16">
        <Section
          title="Architecture at a glance"
          subtitle="The shell host discovers manifests, loads remotes over Module Federation runtime, and mounts slot components."
        >
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-6 text-muted leading-relaxed">
              <p>
                Korporus is built around strict runtime boundaries. Hosts own shell UX and loading behavior. Remotes own app logic and state.
              </p>
              <CodeBlock label="Runtime flow">{`manifest discovery -> schema validation -> remote registration -> bootstrap import -> slot mount`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Technical Design Philosophy"
          subtitle="The technical principles behind Korporus are explicit, inspectable, and operationally predictable."
          variant="alt"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-7 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Runtime contracts first</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Integration is defined by stable contracts: manifests, schema validation, slot tags, and deterministic loading flow.
              </CardContent>
            </Card>
            <Card className="p-7 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Federation boundaries by design</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Hosts own orchestration and shell UX. Remotes own application logic. Module Federation keeps delivery decoupled at runtime.
              </CardContent>
            </Card>
            <Card className="p-7 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Manifest guarantees</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Every remote identity, entrypoint, and slot surface is declared through a strict manifest schema before becoming runnable.
              </CardContent>
            </Card>
            <Card className="p-7 bg-card">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Operational separation</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                App Runner runtime services and Amplify host surfaces can evolve independently, reducing coupling across deployment tiers.
              </CardContent>
            </Card>
            <Card className="p-7 bg-card md:col-span-2">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Security and sandbox assumptions</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Agent procedures run in isolated execution environments with explicit secret boundaries, keeping credentials outside agent containers wherever possible.
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Procedure Studio"
          subtitle="A first-class Korporus environment for developing agent procedures with strong safety and evaluation primitives."
          variant="alt"
        >
          <Card id="agent-procedure-studio" className="p-8 bg-card scroll-mt-28">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-2xl font-bold text-foreground">Domain-specific language + runtime for async agent programs</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-5 text-muted leading-relaxed">
              <p>
                Korporus provides a first-class development experience: an IDE with agent-assisted workflows for authoring
                Lua-based high-level DSL procedures that automate business processes and other long-running agent tasks.
              </p>
              <p>
                The runtime is designed for hybrid AI/ML + programmatic procedures, including context-engineering controls and built-in
                task-level evaluation semantics so procedures can measure success against high-level goals.
              </p>
              <p>
                Security is explicit. Procedures can run in isolated sandboxes (for example e2b or simple containers) while a
                zero-knowledge broker keeps API keys and service credentials outside agent containers to reduce exfiltration risk from
                prompt-injection or supply-chain compromise.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Developer Features" subtitle="Technical capabilities for teams building and operating independent frontend modules." variant="alt">
          <div className="grid gap-6">
            {DEVELOPER_FEATURE_ENTRIES.map((feature) => (
              <DeveloperFeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </Section>

        <Section title="Developer paths" subtitle="Choose where you want to go next.">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <CardHeader className="p-0 mb-2">
                <h3 className="text-lg font-semibold text-foreground">Build Your First App</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Follow the getting-started and guides tracks for manifests, slots, and styling.
              </CardContent>
              <a href="/docs/getting-started/first-app" className="mt-4 inline-block text-sm font-semibold text-foreground hover:text-selected">
                Start guide →
              </a>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 mb-2">
                <h3 className="text-lg font-semibold text-foreground">Reference Contracts</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Read API and schema details before integrating new hosts or remotes.
              </CardContent>
              <a href="/docs/reference" className="mt-4 inline-block text-sm font-semibold text-foreground hover:text-selected">
                Open reference →
              </a>
            </Card>
            <Card className="p-6">
              <CardHeader className="p-0 mb-2">
                <h3 className="text-lg font-semibold text-foreground">Deployment Model</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Plan delivery across Amplify Gen2 hosts and runtime service boundaries.
              </CardContent>
              <a href="/docs/guides/deployment" className="mt-4 inline-block text-sm font-semibold text-foreground hover:text-selected">
                View deployment guide →
              </a>
            </Card>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default DevelopersPage;
