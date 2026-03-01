import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export type TaskDetailIssue = {
  id: string;
  title: string;
  type?: string;
  status?: string;
  priority?: number;
  description?: string;
  assignee?: string;
  created_at?: string;
  updated_at?: string;
  closed_at?: string;
  parent?: string;
  comments?: Array<{ author: string; text: string; created_at?: string }>;
};

export function Card({ className = "", ...props }: DivProps) {
  return <div className={`rounded-2xl bg-card border border-border/60 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={`p-0 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-0 ${className}`} {...props} />;
}

type BoardProps = {
  columns: string[];
  issues: TaskDetailIssue[];
  onSelectIssue?: (issue: TaskDetailIssue) => void;
  selectedIssueId?: string | null;
  className?: string;
  [key: string]: unknown;
};

export function Board({ columns, issues, onSelectIssue, selectedIssueId, className = "" }: BoardProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-3 ${className}`}>
      {columns.map((column) => {
        const columnIssues = issues.filter((issue) => issue.status === column);
        return (
          <div key={column} className="rounded-xl bg-background/60 border border-border/50 p-3">
            <div className="mb-3 text-xs uppercase tracking-wider text-muted font-semibold">
              {column.replace(/_/g, " ")}
            </div>
            <div className="space-y-2">
              {columnIssues.map((issue) => {
                const selected = issue.id === selectedIssueId;
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => onSelectIssue?.(issue)}
                    className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                      selected
                        ? "border-selected bg-selected/10"
                        : "border-border/40 bg-card hover:border-selected/40"
                    }`}
                  >
                    <div className="text-xs text-muted font-mono mb-1">{issue.id}</div>
                    <div className="text-sm font-semibold text-foreground">{issue.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type IssueCardProps = {
  issue: TaskDetailIssue;
  isSelected?: boolean;
  [key: string]: unknown;
};

export function IssueCard({ issue, isSelected }: IssueCardProps) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 bg-card ${
        isSelected ? "border-selected bg-selected/10" : "border-border/50"
      }`}
    >
      <div className="text-xs text-muted font-mono mb-1">{issue.id}</div>
      <div className="text-sm font-semibold text-foreground mb-1">{issue.title}</div>
      <div className="text-xs text-muted">{issue.status ?? "open"}</div>
    </div>
  );
}

type TaskDetailPanelProps = {
  task: TaskDetailIssue | null;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  [key: string]: unknown;
};

export function TaskDetailPanel({ task, isOpen, onClose, className = "" }: TaskDetailPanelProps) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <aside className={`rounded-xl border border-border/60 bg-card p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-mono text-muted">{task.id}</div>
          <h4 className="text-base font-bold text-foreground">{task.title}</h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs rounded px-2 py-1 border border-border/60 text-muted hover:text-foreground"
        >
          Close
        </button>
      </div>
      <p className="text-sm text-muted leading-relaxed">
        {task.description ?? "This detail panel mirrors the shell interaction model used on the Korporus website demo."}
      </p>
    </aside>
  );
}
