import * as React from "react";
import { Layout, Section, Hero, CodeBlock } from "../components";
import { Card, CardContent } from "@korporus/site-ui";

const GettingStartedPage = () => {
  return (
    <Layout>
      <Hero
        title="Getting Started"
        subtitle="Run the shell, start a remote app, and validate runtime composition in minutes."
      />

      <div className="space-y-12">
        <Section title="Install dependencies" subtitle="Korporus is a pnpm workspace with React, Angular, and shared package tooling.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-6 text-muted leading-relaxed">
              <p>Use Node.js 22+ and pnpm 9+ before running workspace commands.</p>
              <CodeBlock label="Workspace setup">{`git clone https://github.com/AnthusAI/Korporus.git
cd Korporus
pnpm install`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>

        <Section title="Run development mode" subtitle="Start the shell and at least one app remote." variant="alt">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-6 text-muted leading-relaxed">
              <CodeBlock label="Shell + remotes">{`# Terminal 1
cd apps/shell && pnpm dev

# Terminal 2
cd packages/app-hello && pnpm dev

# Optional Terminal 3
cd packages/app-docs && pnpm dev`}</CodeBlock>
              <p>Then open <code>http://localhost:3000</code> and launch an app from the shell home screen.</p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Validate host-agnostic embedding" subtitle="Run the React and Angular demo hosts that consume the same remote.">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-6 text-muted leading-relaxed">
              <CodeBlock label="Demo hosts">{`cd apps/demo-react && pnpm dev
cd apps/demo-angular && pnpm start`}</CodeBlock>
              <p>
                Configure each demo with the remote entry URL and verify the same titlebar/main/settings app views render in both frameworks.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Build and verify" subtitle="Confirm all packages compile before deployment." variant="alt">
          <Card className="p-8 bg-card">
            <CardContent className="p-0 space-y-6 text-muted leading-relaxed">
              <CodeBlock label="Workspace checks">{`pnpm build
pnpm typecheck
pnpm test`}</CodeBlock>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
};

export default GettingStartedPage;
