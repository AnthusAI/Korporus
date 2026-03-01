import * as React from "react";
import { marked } from "marked";
import { DocsLayout } from "../components";

type PageContext = {
  currentPath: string;
  sourcePath: string;
  title: string;
  markdown: string;
};

type DocsMarkdownTemplateProps = {
  pageContext: PageContext;
};

const DocsMarkdownTemplate = ({ pageContext }: DocsMarkdownTemplateProps) => {
  const { currentPath, sourcePath, title, markdown } = pageContext;
  const html = React.useMemo(() => {
    const output = marked.parse(markdown);
    return typeof output === "string" ? output : "";
  }, [markdown]);

  return (
    <DocsLayout currentPath={currentPath}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">{title}</h1>
          <p className="mt-3 text-sm font-mono text-muted">Source: {sourcePath}</p>
        </div>

        <div className="docs-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </DocsLayout>
  );
};

export default DocsMarkdownTemplate;
