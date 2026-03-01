import * as React from "react";
import Layout from "./Layout";

type SidebarLink = {
  label: string;
  href: string;
  isHeader?: boolean;
};

const sidebarLinks: SidebarLink[] = [
  { label: "Overview", href: "/docs" },

  { label: "Getting Started", href: "#", isHeader: true },
  { label: "Introduction", href: "/docs/getting-started" },
  { label: "Installation", href: "/docs/getting-started/installation" },
  { label: "First App", href: "/docs/getting-started/first-app" },

  { label: "Architecture", href: "#", isHeader: true },
  { label: "Architecture Overview", href: "/docs/architecture" },
  { label: "Shell Host", href: "/docs/architecture/shell" },
  { label: "Module Federation", href: "/docs/architecture/module-federation" },
  { label: "Manifests", href: "/docs/architecture/manifests" },
  { label: "Web Components", href: "/docs/architecture/web-components" },

  { label: "Guides", href: "#", isHeader: true },
  { label: "Guides Overview", href: "/docs/guides" },
  { label: "Creating an App", href: "/docs/guides/creating-an-app" },
  { label: "State Management", href: "/docs/guides/state-management" },
  { label: "Styling", href: "/docs/guides/styling" },
  { label: "Deployment", href: "/docs/guides/deployment" },

  { label: "Reference", href: "#", isHeader: true },
  { label: "Reference Overview", href: "/docs/reference" },
  { label: "Shell API", href: "/docs/reference/shell-api" },
  { label: "Manifest Schema", href: "/docs/reference/app-manifest-schema" },
  { label: "Web Component Wrapper API", href: "/docs/reference/web-component-wrapper-api" },

  { label: "Feature Routes", href: "#", isHeader: true },
  { label: "Shell Host", href: "/docs/features/core-management" },
  { label: "Runtime Composition", href: "/docs/features/kanban-board" },
  { label: "Manifest Discovery", href: "/docs/features/jira-sync" },
  { label: "Slot Contract", href: "/docs/features/local-tasks" },
  { label: "Cross-Framework Hosts", href: "/docs/features/virtual-projects" },
  { label: "Shared State", href: "/docs/features/beads-compatibility" },
  { label: "Editor Integration", href: "/docs/features/vscode-plugin" },
  { label: "Documentation Pipeline", href: "/docs/features/integrated-wiki" },
  { label: "Deployment Topology", href: "/docs/features/policy-as-code" },

  { label: "Compatibility", href: "#", isHeader: true },
  { label: "CLI (legacy route)", href: "/docs/cli" },
  { label: "Configuration (legacy route)", href: "/docs/configuration" },
  { label: "Directory Structure (legacy route)", href: "/docs/directory-structure" }
];

type DocsLayoutProps = {
  children: React.ReactNode;
  currentPath?: string;
};

const isActivePath = (currentPath: string | undefined, href: string): boolean => {
  if (!currentPath) {
    return false;
  }

  if (href === "/docs") {
    return currentPath === "/docs";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
};

const DocsLayout = ({ children, currentPath }: DocsLayoutProps) => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex flex-col md:flex-row gap-12">
        <aside className="md:w-72 flex-shrink-0">
          <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto pr-2">
            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">Documentation</h3>
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                if (link.isHeader) {
                  return (
                    <li key={link.label} className="pt-4">
                      <h4 className="text-xs font-semibold text-muted tracking-wider uppercase px-3">{link.label}</h4>
                    </li>
                  );
                }

                const isActive = isActivePath(currentPath, link.href);

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`block px-3 py-2 text-sm rounded-md transition-all border-l-2 ${
                        isActive
                          ? "bg-selected/10 text-selected font-medium border-selected"
                          : "text-muted hover:text-foreground hover:bg-card-muted/50 border-transparent"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 min-w-0 space-y-12">{children}</div>
      </div>
    </Layout>
  );
};

export default DocsLayout;
