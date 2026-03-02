import * as React from "react";
import { Layout, Section, Hero } from "../../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";
import { FEATURE_ENTRIES } from "../../content/features";

const USER_SECTIONS = [
  {
    id: "one-home",
    title: "One Home for Every App",
    subtitle: "Users start from one launch surface instead of memorizing separate URLs.",
    body: [
      "Korporus keeps app discovery simple: one home screen, one navigation model, one place to start work.",
      "The same launch model applies across every app, so teams spend less time relearning navigation."
    ]
  },
  {
    id: "one-click",
    title: "Open in One Click",
    subtitle: "Move from selection to focused app views immediately.",
    body: [
      "App entry points are visible and direct, so users can jump to the right workflow quickly.",
      "There is no complex setup flow between app selection and active work."
    ]
  },
  {
    id: "consistent-controls",
    title: "Consistent Controls",
    subtitle: "The product keeps a stable visual frame as users switch apps.",
    body: [
      "Titlebar, main area, and settings panel behave consistently across app boundaries.",
      "That consistency lowers training overhead and helps users build muscle memory."
    ]
  },
  {
    id: "settings-sidebar",
    title: "Focused Settings Panel",
    subtitle: "Adjust behavior without leaving the task context.",
    body: [
      "Users can open settings alongside active content instead of navigating to disconnected preferences pages.",
      "Changes are easier to test in context, reducing trial-and-error loops."
    ]
  },
  {
    id: "responsive-views",
    title: "Fast, Responsive Views",
    subtitle: "Transitions keep interaction momentum high.",
    body: [
      "Views update smoothly as users move between app functions and supporting panels.",
      "The interface favors immediate feedback over heavy page reload patterns."
    ]
  },
  {
    id: "visual-language",
    title: "Clear Visual Language",
    subtitle: "Shared motion and layout cues make behavior legible.",
    body: [
      "Korporus uses consistent panel rhythm, depth, and interaction treatment to reduce interface ambiguity.",
      "Users can quickly infer where controls live and what state changes mean."
    ]
  },
  {
    id: "workflow-process-monitoring",
    title: "Integrated Workflow Oversight",
    subtitle: "Process monitoring for asynchronous agents at a level above logs and dashboards.",
    body: [
      "A Git-backed workflow layer is built into the OS for project planning and execution tracking.",
      "Agents can publish long-term plans, update status as work progresses, and keep humans aligned without requiring log spelunking."
    ]
  },
  {
    id: "agent-procedure-studio",
    title: "Agent Procedure Studio",
    subtitle: "A new programming language workflow for agent-based business process automation.",
    body: [
      "Korporus includes first-class support for programmable procedures: agent-assisted IDE tooling, Lua-based high-level DSL authoring, and context-engineering controls.",
      "Procedures can combine AI/ML and programmatic techniques, evaluate success against high-level goals, and run in secure sandboxes with secrets kept outside the agent container."
    ]
  },
  {
    id: "reliable-delivery",
    title: "Reliable Cloud Delivery",
    subtitle: "Users get predictable access and consistent loading behavior.",
    body: [
      "Deployment infrastructure prioritizes stable host delivery and dependable runtime access.",
      "The result is a calmer user experience with fewer edge-case failures during daily use."
    ]
  }
] as const;

const FeaturesPage = () => {
  return (
    <Layout>
      <Hero
        title="Features for Users"
        subtitle="Korporus focuses on daily usability: one home, one interaction model, and one consistent product experience across many apps."
      />

      <div className="space-y-16">
        <Section title="Product highlights" subtitle="High-level outcomes users notice immediately.">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURE_ENTRIES.filter((feature) => feature.href.startsWith("/features#")).map((feature, index) => (
              <a key={feature.title} href={feature.href} className="group block h-full">
                <Card className="p-6 md:p-7 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <CardHeader className="p-0 mb-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">User Feature {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-selected transition-colors">
                      {feature.title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </h3>
                  </CardHeader>
                  <CardContent className="p-0 text-muted leading-relaxed">{feature.description}</CardContent>
                </Card>
              </a>
            ))}
          </div>
        </Section>

        <Section title="Feature details" subtitle="A closer look at how each user-facing capability improves day-to-day usage." variant="alt">
          <div className="space-y-6">
            {USER_SECTIONS.map((section) => (
              <Card key={section.id} id={section.id} className="p-8 scroll-mt-28">
                <CardHeader className="p-0 mb-3">
                  <h3 className="text-2xl font-bold text-foreground">{section.title}</h3>
                  <p className="mt-2 text-muted">{section.subtitle}</p>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-muted leading-relaxed">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="For developers"
          subtitle="Technical details like manifests, module federation runtime, and cross-framework hosting are organized in the developer section."
        >
          <Card className="p-8">
            <CardContent className="p-0 text-center">
              <p className="text-muted leading-relaxed mb-6">
                If you are implementing or integrating Korporus, switch to the dedicated developer information architecture.
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

export default FeaturesPage;
