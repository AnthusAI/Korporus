import * as React from "react";

type VmlPreviewPlayerProps = {
  xmlPath: string;
};

export function VmlPreviewPlayer({ xmlPath }: VmlPreviewPlayerProps) {
  return (
    <div className="w-full h-full min-h-[280px] rounded-xl border border-border/60 bg-card flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-sm uppercase tracking-wider text-muted font-mono mb-3">Video Preview Placeholder</p>
        <p className="text-sm text-muted leading-relaxed">
          VideoML live preview is intentionally scoped out for this draft website.
        </p>
        <p className="text-xs text-muted/80 mt-2 font-mono">{xmlPath}</p>
      </div>
    </div>
  );
}
