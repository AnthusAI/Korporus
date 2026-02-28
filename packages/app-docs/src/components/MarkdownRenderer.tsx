import { createElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { Components } from "react-markdown";
import { useDocsStore } from "../store";
import { resolvePath } from "../lib/pathUtils";

/** Styles for rendered markdown elements. */
const styles = {
  h1: { fontSize: 28, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.3 } as const,
  h2: { fontSize: 22, fontWeight: 600, margin: "32px 0 12px", lineHeight: 1.3, paddingBottom: 8, borderBottom: "1px solid #e2e8f0" } as const,
  h3: { fontSize: 18, fontWeight: 600, margin: "24px 0 8px", lineHeight: 1.3 } as const,
  h4: { fontSize: 15, fontWeight: 600, margin: "20px 0 8px", lineHeight: 1.3 } as const,
  p: { margin: "0 0 12px", lineHeight: 1.7 } as const,
  a: { color: "#3b82f6", textDecoration: "none" } as const,
  code: { backgroundColor: "#f1f5f9", padding: "2px 5px", borderRadius: 3, fontSize: "0.9em", fontFamily: "'SF Mono', Consolas, monospace" } as const,
  pre: { backgroundColor: "#1e293b", color: "#e2e8f0", padding: 16, borderRadius: 8, overflow: "auto", margin: "0 0 16px", fontSize: 13, lineHeight: 1.5 } as const,
  blockquote: { margin: "0 0 16px", padding: "8px 16px", borderLeft: "3px solid #3b82f6", backgroundColor: "#eff6ff", color: "#1e40af" } as const,
  ul: { margin: "0 0 12px", paddingLeft: 24 } as const,
  ol: { margin: "0 0 12px", paddingLeft: 24 } as const,
  li: { marginBottom: 4, lineHeight: 1.7 } as const,
  table: { width: "100%", borderCollapse: "collapse" as const, margin: "0 0 16px", fontSize: 14 } as const,
  th: { textAlign: "left" as const, padding: "8px 12px", borderBottom: "2px solid #e2e8f0", fontWeight: 600 } as const,
  td: { padding: "8px 12px", borderBottom: "1px solid #e2e8f0" } as const,
  hr: { border: "none", borderTop: "1px solid #e2e8f0", margin: "24px 0" } as const,
};

function HeadingWithAnchor({
  level,
  id,
  children,
}: {
  level: number;
  id?: string;
  children: ReactNode;
}) {
  const tag = `h${level}`;
  const style = level === 1 ? styles.h1 : level === 2 ? styles.h2 : level === 3 ? styles.h3 : styles.h4;

  const copyAnchor = () => {
    if (id) {
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
    }
  };

  return createElement(
    tag,
    { id, style: { ...style, position: "relative", cursor: id ? "pointer" : "default" } },
    children,
    id &&
      createElement(
        "span",
        {
          onClick: copyAnchor,
          style: { marginLeft: 8, color: "#94a3b8", fontSize: "0.75em", opacity: 0.5, cursor: "pointer" },
          title: "Copy link",
        },
        "#",
      ),
  );
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const currentPath = useDocsStore((s) => s.currentPath);
  const setCurrentPath = useDocsStore((s) => s.setCurrentPath);

  const components: Components = {
    h1: ({ children, ...props }) => <HeadingWithAnchor level={1} id={props.id}>{children}</HeadingWithAnchor>,
    h2: ({ children, ...props }) => <HeadingWithAnchor level={2} id={props.id}>{children}</HeadingWithAnchor>,
    h3: ({ children, ...props }) => <HeadingWithAnchor level={3} id={props.id}>{children}</HeadingWithAnchor>,
    h4: ({ children, ...props }) => <HeadingWithAnchor level={4} id={props.id}>{children}</HeadingWithAnchor>,
    p: ({ children }) => <p style={styles.p}>{children}</p>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
      if (!isExternal && href) {
        const resolved = resolvePath(currentPath, href);
        return (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPath(resolved); }}
            style={styles.a}
          >
            {children}
          </a>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" style={styles.a}>{children}</a>;
    },
    code: ({ className, children }) => {
      const isBlock = className?.startsWith("language-");
      if (isBlock) {
        return <code style={{ fontFamily: "'SF Mono', Consolas, monospace" }}>{children}</code>;
      }
      return <code style={styles.code}>{children}</code>;
    },
    pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
    blockquote: ({ children }) => <blockquote style={styles.blockquote}>{children}</blockquote>,
    ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
    ol: ({ children }) => <ol style={styles.ol}>{children}</ol>,
    li: ({ children }) => <li style={styles.li}>{children}</li>,
    table: ({ children }) => <table style={styles.table}>{children}</table>,
    th: ({ children }) => <th style={styles.th}>{children}</th>,
    td: ({ children }) => <td style={styles.td}>{children}</td>,
    hr: () => <hr style={styles.hr} />,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
