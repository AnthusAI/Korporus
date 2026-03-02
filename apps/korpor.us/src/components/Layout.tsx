import * as React from "react";

const topNavigation = [
  { label: "Demo", href: "/demo" },
  { label: "Developers", href: "/developers" }
];

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <style>{`.footer-compact { line-height: 1.3; }`}</style>
      <header className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <nav className="flex items-center gap-6 w-full">
            <a
              href="/"
              className="hover:text-selected hover:drop-shadow-[0_0_2px_rgba(125,211,252,0.4)] transition-all duration-300 flex items-center"
            >
              <span className="text-[25px] leading-none font-black tracking-[3px]" style={{ WebkitTextStroke: "1px currentColor" }}>
                <span className="text-muted">KOR</span>
                <span className="text-muted">PORUS</span>
              </span>
            </a>

            <div className="ml-auto flex items-center gap-3">
              {topNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hidden md:block text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}

              <a href="https://github.com/AnthusAI/Korporus" className="hidden md:inline-flex text-muted hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-md/70 p-2 text-muted hover:text-foreground hover:border-border transition-colors bg-card"
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span className="h-5 w-5 inline-flex items-center justify-center text-lg leading-none">
                  {mobileOpen ? "×" : "≡"}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {mobileOpen ? (
          <div className="md:hidden bg-card">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-5">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">Navigation</p>
                {topNavigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-medium text-muted hover:text-foreground transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href="https://github.com/AnthusAI/Korporus"
                className="block text-sm font-medium text-muted hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                GitHub
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1 w-full flex flex-col">{children}</main>

      <footer className="bg-footer-bg py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 md:gap-y-6">
            <div className="col-span-2 text-muted">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 gap-x-8 text-sm text-muted footer-compact">
                <li className="font-semibold col-span-1 sm:col-span-2 opacity-75">Operating System</li>
                <li><a href="/features#one-home" className="text-muted hover:text-selected block">One Home for Every App</a></li>
                <li><a href="/features#one-click" className="text-muted hover:text-selected block">Open in One Click</a></li>
                <li><a href="/features#consistent-controls" className="text-muted hover:text-selected block">Consistent Controls</a></li>
                <li><a href="/features#settings-sidebar" className="text-muted hover:text-selected block">Focused Settings</a></li>
                <li><a href="/features#responsive-views" className="text-muted hover:text-selected block">Responsive Views</a></li>
                <li><a href="/features#visual-language" className="text-muted hover:text-selected block">Visual Language</a></li>
                <li><a href="/features#workflow-process-monitoring" className="text-muted hover:text-selected block">Integrated Workflow Oversight</a></li>
                <li><a href="/features#agent-procedure-studio" className="text-muted hover:text-selected block">Agent Procedure Studio</a></li>
                <li><a href="/features#reliable-delivery" className="text-muted hover:text-selected block">Reliable Delivery</a></li>
              </ul>
              <div className="mt-6 space-y-4">
                <div className="h-20 sm:h-24 flex items-end">
                  <img src="/images/logo.svg" alt="Korporus logo" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col h-full text-muted">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="col-span-1">
                  <ul className="grid gap-y-1 text-sm text-muted footer-compact">
                    <li className="font-semibold opacity-75">Developers</li>
                    <li><a href="/developers" className="text-muted hover:text-selected block">Developer Portal</a></li>
                    <li><a href="/features/core-management" className="text-muted hover:text-selected block">Shell Host Runtime</a></li>
                    <li><a href="/features/kanban-board" className="text-muted hover:text-selected block">Federation Composition</a></li>
                    <li><a href="/features/jira-sync" className="text-muted hover:text-selected block">Manifest Contract</a></li>
                    <li><a href="/developers#agent-procedure-studio" className="text-muted hover:text-selected block">Procedure Runtime</a></li>
                    <li><a href="/docs" className="text-muted hover:text-selected block">Documentation</a></li>
                  </ul>
                </div>
                <div className="col-span-1 md:text-right">
                  <ul className="grid gap-y-1 text-sm text-muted footer-compact">
                    <li className="font-semibold opacity-75">Reference</li>
                    <li><a href="/demo" className="text-muted hover:text-selected block md:inline-block">Demo</a></li>
                    <li><a href="/philosophy" className="text-muted hover:text-selected block md:inline-block">Philosophy</a></li>
                    <li><a href="/architecture" className="text-muted hover:text-selected block md:inline-block">Architecture</a></li>
                    <li><a href="https://github.com/AnthusAI/Korporus" className="text-muted hover:text-selected block md:inline-block">GitHub</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-sm text-muted space-y-4">
                <div className="flex items-center gap-2 justify-start md:justify-end">
                  <span className="whitespace-nowrap">Free and open-source software</span>
                  <a
                    href="https://github.com/AnthusAI/Korporus"
                    className="text-muted hover:text-foreground transition-colors shrink-0"
                    aria-label="Korporus on GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
                <div className="flex items-end justify-start sm:justify-end">
                  <a
                    href="https://anth.us/ryan/"
                    className="text-muted hover:text-foreground transition-colors whitespace-nowrap block sm:text-right"
                  >
                    by Ryan Porter and Derek Norrbom
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
