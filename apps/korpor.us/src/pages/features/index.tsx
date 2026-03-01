import * as React from "react";
import { Layout, Section, Hero } from "../../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";
import { FEATURE_ENTRIES } from "../../content/features";

const FeatureCard = ({ title, description, href }: { title: string; description: string; href: string }) => (
  <a href={href} className="group h-full block">
    <Card className="p-6 h-full transition-transform group-hover:-translate-y-1">
      <CardHeader className="p-0 mb-3">
        <h3 className="text-xl font-bold text-foreground group-hover:text-selected transition-colors">
          {title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </h3>
      </CardHeader>
      <CardContent className="p-0 text-muted leading-relaxed">{description}</CardContent>
    </Card>
  </a>
);

const FeaturesPage = () => {
  return (
    <Layout>
      <Hero title="Features" subtitle="Korporus capabilities organized in the same full route structure used throughout the site." />

      <div className="space-y-20">
        <Section title="Core Runtime" subtitle="Host shell, runtime composition, and manifest discovery.">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURE_ENTRIES.slice(0, 3).map((feature) => (
              <FeatureCard key={feature.href} title={feature.title} description={feature.description} href={feature.href} />
            ))}
          </div>
        </Section>

        <Section title="App Composition" subtitle="Slot boundaries and cross-framework embedding." variant="alt">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURE_ENTRIES.slice(3, 6).map((feature) => (
              <FeatureCard key={feature.href} title={feature.title} description={feature.description} href={feature.href} />
            ))}
          </div>
        </Section>

        <Section title="Docs and Operations" subtitle="Documentation surfaces and deployment model.">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURE_ENTRIES.slice(6).map((feature) => (
              <FeatureCard key={feature.href} title={feature.title} description={feature.description} href={feature.href} />
            ))}
          </div>
        </Section>

        <Section title="Documentation" subtitle="Learn architecture, implementation, and deployment details." variant="alt">
          <Card className="p-8">
            <CardContent className="p-0 text-center">
              <p className="text-muted leading-relaxed mb-6">
                Explore the docs sections generated from repository markdown and reference files.
              </p>
              <a href="/docs" className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
                View Documentation →
              </a>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
};

export default FeaturesPage;
