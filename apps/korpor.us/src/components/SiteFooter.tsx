import * as React from "react";
import AnthusFooter from "anthus-footer";

const SiteFooter = () => {
  return (
    <AnthusFooter
      siteId="korporus"
      subtitle="Part of the Anthus Platform"
      description="Korporus is the Anthus AI agent operating system: a federated shell for hosting apps, procedures, and operational workflows in one runtime."
      byline="Built by Anthus AI Solutions"
      logo={<img src="/images/logo.svg" alt="Korporus logo" style={{ height: 56, width: "auto" }} />}
      additionalColumns={[
        {
          title: "Operating System",
          links: [
            { label: "One Home for Every App", href: "/features#one-home", external: false },
            { label: "Federated Composition", href: "/features/kanban-board", external: false },
            { label: "Procedure Runtime", href: "/developers#agent-procedure-studio", external: false },
            { label: "Reliable Delivery", href: "/features#reliable-delivery", external: false },
          ],
        },
        {
          title: "Reference",
          links: [
            { label: "Demo", href: "/demo", external: false },
            { label: "Developers", href: "/developers", external: false },
            { label: "Architecture", href: "/architecture", external: false },
            { label: "GitHub", href: "https://github.com/AnthusAI/Korporus" },
          ],
        },
      ]}
    />
  );
};

export default SiteFooter;
