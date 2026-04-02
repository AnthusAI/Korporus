import * as React from "react";
import { Layout, Section, Hero } from "../components";

const ArchitecturePage = () => {
  return (
    <Layout>
      <Hero
        title="Architecture"
        subtitle="Korporus combines Module Federation, manifest validation, and Web Components into a runtime composition platform."
      />

      <div className="space-y-12">
        <Section
          title="Where this fits in the Anthus Platform"
          subtitle="Architecture matters here because Korporus is the shell around the rest of the stack."
          variant="alt"
        >
          <div className="rounded-2xl bg-card p-8">
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Korporus is the Anthus Platform host layer. It gives products like
                <a href="https://plexus.anth.us" className="text-selected hover:underline"> Plexus</a>,
                <a href="https://kanb.us" className="text-selected hover:underline"> Kanbus</a>, and future
                <a href="https://anth.us/platform/biblicus" className="text-selected hover:underline"> Biblicus</a>-style interfaces a
                consistent runtime contract while keeping each module independently deployable.
              </p>
              <p>
                Common recipe: host a Tactus-backed procedure app in Korporus, wire in Plexus for evaluation, and use
                Caducus-adjacent operator surfaces when long-running services need monitoring and triage.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Host and remote model" subtitle="The shell is the host; app packages are remotes.">
          <div className="rounded-2xl bg-card p-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Runtime bootstrap loading</h3>
            </div>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                The host resolves an app manifest, registers the remote entry with Module Federation runtime,
                and imports the remote bootstrap module.
              </p>
              <p>
                Bootstrap registers custom elements for titlebar, main, and settings views.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Manifest and schema" subtitle="Validation protects the runtime boundary." variant="alt">
          <div className="rounded-2xl bg-card p-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Strict manifest contract</h3>
            </div>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Every app advertises metadata, remote entry URL, and slot tag names through a JSON manifest.
              </p>
              <p>
                The schema package ensures malformed manifests fail before any runtime import occurs.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Slot mounting" subtitle="Host surfaces remain consistent while app internals stay isolated.">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-8">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-foreground">Titlebar/Main/Settings</h3>
              </div>
              <div className="text-muted leading-relaxed">
                The shell layout reserves three regions. Remotes provide custom elements for any subset of those slots.
              </div>
            </div>
            <div className="rounded-2xl bg-card p-8">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-foreground">Shared app state</h3>
              </div>
              <div className="text-muted leading-relaxed">
                Because slot components run in one remote runtime context, app state can synchronize naturally across mounted views.
              </div>
            </div>
          </div>
        </Section>

        <Section title="Deployment topology" subtitle="Static hosts and remote runtime infrastructure are decoupled." variant="alt">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-8">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-foreground">App Runner runtime</h3>
              </div>
              <div className="text-muted leading-relaxed">
                The containerized shell and remote assets run on App Runner with scale-to-zero support.
              </div>
            </div>
            <div className="rounded-2xl bg-card p-8">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-foreground">Amplify host apps</h3>
              </div>
              <div className="text-muted leading-relaxed">
                React and Angular demo hosts deploy independently to Amplify Gen2 while consuming the same runtime remote contract.
              </div>
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default ArchitecturePage;
