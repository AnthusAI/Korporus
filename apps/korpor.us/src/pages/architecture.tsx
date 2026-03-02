import * as React from "react";
import { Layout, Section, Hero } from "../components";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";

const ArchitecturePage = () => {
  return (
    <Layout>
      <Hero
        title="Architecture"
        subtitle="Korporus combines Module Federation, manifest validation, and Web Components into a runtime composition platform."
      />

      <div className="space-y-12">
        <Section title="Host and remote model" subtitle="The shell is the host; app packages are remotes.">
          <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-xl font-bold text-foreground">Runtime bootstrap loading</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                The host resolves an app manifest, registers the remote entry with Module Federation runtime,
                and imports the remote bootstrap module.
              </p>
              <p>
                Bootstrap registers custom elements for titlebar, main, and settings views.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Manifest and schema" subtitle="Validation protects the runtime boundary." variant="alt">
          <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <h3 className="text-xl font-bold text-foreground">Strict manifest contract</h3>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
              <p>
                Every app advertises metadata, remote entry URL, and slot tag names through a JSON manifest.
              </p>
              <p>
                The schema package ensures malformed manifests fail before any runtime import occurs.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Slot mounting" subtitle="Host surfaces remain consistent while app internals stay isolated.">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Titlebar/Main/Settings</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                The shell layout reserves three regions. Remotes provide custom elements for any subset of those slots.
              </CardContent>
            </Card>
            <Card className="p-8">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Shared app state</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                Because slot components run in one remote runtime context, app state can synchronize naturally across mounted views.
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Deployment topology" subtitle="Static hosts and remote runtime infrastructure are decoupled." variant="alt">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">App Runner runtime</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                The containerized shell and remote assets run on App Runner with scale-to-zero support.
              </CardContent>
            </Card>
            <Card className="p-8">
              <CardHeader className="p-0 mb-3">
                <h3 className="text-xl font-bold text-foreground">Amplify host apps</h3>
              </CardHeader>
              <CardContent className="p-0 text-muted leading-relaxed">
                React and Angular demo hosts deploy independently to Amplify Gen2 while consuming the same runtime remote contract.
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default ArchitecturePage;
