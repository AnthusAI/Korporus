import * as React from "react";
import { type FramePictogramProps, clamp01, pingPong, useResolvedFrame } from "./FramePictogram";

export function CopilotArtifactsPictogram({ frame, fps = 30, className, style }: FramePictogramProps) {
  const resolvedFrame = useResolvedFrame(frame, fps);
  const seconds = resolvedFrame / fps;
  const cycle = seconds / 5.5;
  const cursorY = 116 + pingPong(cycle) * 120;
  const paneGlow = clamp01(0.25 + Math.sin(seconds * 1.6) * 0.18);

  return (
    <div className={`w-full min-h-[300px] rounded-2xl overflow-hidden bg-card ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 640 340" width="100%" height="100%" role="img" aria-label="Copilot and artifacts pictogram">
        <defs>
          <linearGradient id="copilot-pane" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--column)" />
            <stop offset="100%" stopColor="var(--card)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="340" fill="var(--background)" />
        <rect x="52" y="44" width="536" height="252" rx="18" fill="url(#copilot-pane)" />

        <rect x="72" y="64" width="352" height="212" rx="12" fill="var(--background)" />
        <rect x="436" y="64" width="132" height="212" rx="12" fill="var(--background)" />

        <rect x="90" y="86" width="192" height="14" rx="6" fill="var(--card-muted)" />
        <rect x="90" y="108" width="268" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="90" y="128" width="252" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="90" y="150" width="208" height="12" rx="6" fill="var(--card-muted)" />

        <rect x="90" y="178" width="312" height="78" rx="10" fill="var(--column)" />
        <rect x="106" y="194" width="138" height="10" rx="5" fill="var(--card-muted)" />
        <rect x="106" y="212" width="278" height="10" rx="5" fill="var(--card-muted)" />
        <rect x="106" y="230" width="232" height="10" rx="5" fill="var(--card-muted)" />

        <rect x="448" y="86" width="108" height="18" rx="8" fill="var(--card-muted)" />
        <rect x="448" y="114" width="96" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="448" y="134" width="96" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="448" y="154" width="84" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="448" y="182" width="108" height="58" rx="10" fill="var(--column)" />

        <circle cx="458" cy={cursorY} r="6" fill="var(--text-selected)" opacity={0.65 + paneGlow * 0.35} />
        <rect x="470" y={cursorY - 8} width="76" height="16" rx="7" fill="var(--text-selected)" opacity={0.35 + paneGlow * 0.35} />

        <text x="78" y="80" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="10">ARTIFACT</text>
        <text x="442" y="80" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="10">COPILOT</text>
      </svg>
    </div>
  );
}
