import * as React from "react";
export * from "./kanban";
export type { TaskDetailIssue, IssueEvent, IssueEventsResponse } from "./kanban";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return <div className={`rounded-2xl bg-card border border-border/60 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={`p-0 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-0 ${className}`} {...props} />;
}
