import * as React from "react";
import { Layout, Section, Hero, CodeBlock } from "../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";

const SHELL_DEMO_URL = process.env.GATSBY_SHELL_DEMO_URL ?? "https://awdmyggmnm.us-east-1.awsapprunner.com";
const REACT_DEMO_URL = process.env.GATSBY_REACT_DEMO_URL;
const ANGULAR_DEMO_URL = process.env.GATSBY_ANGULAR_DEMO_URL;

const LiveDemoActions = ({ liveUrl, sourcePath }: { liveUrl?: string; sourcePath: string }) => (
  <div className="flex flex-wrap items-center gap-3 pt-2">
    {liveUrl ? (
      <a
        href={liveUrl}
        target="_blank"
        rel="noreferrer"
        className="cta-button px-5 py-2 text-sm transition-all hover:brightness-95"
      >
        Open Live Demo
      </a>
    ) : (
      <span className="inline-flex items-center rounded-md border border-border/70 bg-card-muted/50 px-4 py-2 text-sm font-medium text-muted">
        Live URL pending deployment config
      </span>
    )}
    <a
      href={sourcePath}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold text-foreground hover:text-selected transition-colors"
    >
      View Source <span aria-hidden="true">→</span>
    </a>
  </div>
);

const DemoPage = () => {
  return (
    <Layout>
      <Hero
        title="Deployment Demo"
        subtitle="Three running demonstrations show the same federated app contract across App Runner and Amplify host surfaces."
      />

      <div className="space-y-12">
        <Section
          title="1. Shell app on App Runner"
          subtitle="The primary Korporus shell is containerized on App Runner and composes multiple apps via Module Federation runtime."
        >
          <Card className="p-8 bg-card">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-2xl font-bold text-foreground">Runtime composition host</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-5 text-muted leading-relaxed">
              <p>
                This deployment is the canonical runtime host. The shell fetches app manifests, validates the schema, resolves remote entry URLs,
                imports bootstraps through Module Federation, and mounts each app into titlebar/main/settings slots.
              </p>
              <p>
                Multiple independent apps can be loaded without rebuilding the shell. Each remote owns its own delivery cadence while the host keeps
                stable UX and orchestration boundaries.
              </p>
              <LiveDemoActions liveUrl={SHELL_DEMO_URL} sourcePath="https://github.com/AnthusAI/Korporus/tree/main/apps/shell" />
              <CodeBlock label="Shell runtime flow">{`manifest discovery -> schema validation -> remote registration -> bootstrap import -> slot mount
host platform: AWS App Runner (containerized shell runtime)`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="2. React app on Amplify"
          subtitle="A separate React host on Amplify embeds one of the same remote apps from the App Runner runtime."
          variant="alt"
        >
          <Card className="p-8 bg-card">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-2xl font-bold text-foreground">Cross-host embedding (React)</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-5 text-muted leading-relaxed">
              <p>
                The React demo host proves host-agnostic integration. It consumes the same manifest and remote entry contract as the shell,
                then mounts the remote app using the same Web Component boundaries.
              </p>
              <p>
                This demonstrates that Korporus remotes are not tied to one shell implementation. A static Amplify-hosted React app can pull and run
                the same business app that also runs inside the primary App Runner shell.
              </p>
              <LiveDemoActions liveUrl={REACT_DEMO_URL} sourcePath="https://github.com/AnthusAI/Korporus/tree/main/apps/demo-react" />
              <CodeBlock label="React host topology">{`host platform: AWS Amplify Gen2 (React host)
remote source: App Runner shell runtime endpoints
contract: shared manifest schema + slot tags`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="3. Angular app on Amplify"
          subtitle="An Angular host demonstrates the same embedding pattern and runtime contract using a different framework."
        >
          <Card className="p-8 bg-card">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-2xl font-bold text-foreground">Cross-host embedding (Angular)</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-5 text-muted leading-relaxed">
              <p>
                The Angular demo repeats the same integration shape as React: resolve manifest metadata, load the remote entry at runtime,
                and mount remote custom elements into host-controlled layout regions.
              </p>
              <p>
                Matching behavior across React and Angular verifies framework independence of the Korporus app contract. Teams can adopt the
                same remote app in different host stacks without app-level forks.
              </p>
              <LiveDemoActions liveUrl={ANGULAR_DEMO_URL} sourcePath="https://github.com/AnthusAI/Korporus/tree/main/apps/demo-angular" />
              <CodeBlock label="Angular host topology">{`host platform: AWS Amplify Gen2 (Angular host)
remote source: App Runner runtime assets
result: one remote app reused across shell + React + Angular`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
};

export default DemoPage;
