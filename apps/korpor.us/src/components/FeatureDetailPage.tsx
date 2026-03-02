import * as React from "react";
import { Layout, Section, Hero, FullVideoPlayer, FeaturePictogram } from "./index";
import { Card, CardContent, CardHeader } from "@korporus/site-ui";
import { FEATURE_DETAILS } from "../content/featureDetails";
import { getVideoById } from "../content/videos";
import { getVideoSrc } from "../lib/getVideoSrc";

type FeatureDetailPageProps = {
  slug: string;
};

export function FeatureDetailPage({ slug }: FeatureDetailPageProps) {
  const feature = FEATURE_DETAILS[slug];

  if (!feature) {
    return (
      <Layout>
        <Section title="Feature Not Found" subtitle="This feature route does not have configured content.">
          <Card className="p-8">
            <CardContent className="p-0 text-muted">Unknown feature slug: {slug}</CardContent>
          </Card>
        </Section>
      </Layout>
    );
  }

  const featureVideo = getVideoById(slug);
  const videoPoster = featureVideo?.poster ? getVideoSrc(featureVideo.poster) : undefined;
  const videoSrc = featureVideo ? getVideoSrc(featureVideo.filename) : "";

  return (
    <Layout>
      <Hero
        title={feature.title}
        subtitle={feature.subtitle}
        rightPane={<FeaturePictogram type={feature.slug} />}
        bottomPane={
          <div className="w-full flex flex-col items-center justify-center mt-12 mb-8 gap-12">
            <FullVideoPlayer src={videoSrc} poster={videoPoster} videoId={feature.slug} />
          </div>
        }
      />

      <div className="space-y-12">
        {feature.sections.map((section) => (
          <Section key={section.title} title={section.title} subtitle={section.subtitle} variant={section.alt ? "alt" : "default"}>
            <Card className="p-8 bg-card">
              <CardHeader className="p-0 mb-4">
                <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-muted leading-relaxed">
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </CardContent>
            </Card>
          </Section>
        ))}

        <Section title="Learn More" subtitle="Dive deeper in the documentation.">
          <Card className="p-8">
            <CardContent className="p-0 text-center">
              <p className="text-muted leading-relaxed mb-6">
                Explore implementation details, APIs, and deployment notes in the Korporus docs.
              </p>
              <a href={feature.docsHref} className="cta-button px-6 py-3 text-sm transition-all hover:brightness-95">
                Read the Documentation →
              </a>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
}
