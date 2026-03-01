import * as React from "react";
import { type FramePictogramProps, pingPong, useResolvedFrame } from "./FramePictogram";

export function BackgroundMonitoringPictogram({ frame, fps = 30, className, style }: FramePictogramProps) {
  const resolvedFrame = useResolvedFrame(frame, fps);
  const seconds = resolvedFrame / fps;
  const cycle = seconds / 6;
  const backlogY = 122 + pingPong(cycle) * 66;
  const progressY = 122 + pingPong(cycle + 0.35) * 66;
  const doneY = 122 + pingPong(cycle + 0.7) * 66;
  const blink = 0.5 + pingPong(cycle + 0.15) * 0.5;

  return (
    <div className={`w-full min-h-[300px] rounded-2xl overflow-hidden bg-card ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 640 340" width="100%" height="100%" role="img" aria-label="Background monitoring pictogram">
        <rect x="0" y="0" width="640" height="340" fill="var(--background)" />
        <rect x="44" y="44" width="552" height="252" rx="18" fill="var(--column)" />
        <rect x="64" y="66" width="512" height="34" rx="10" fill="var(--card)" />
        <text x="78" y="88" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="11">ASYNC WORK OVERVIEW</text>

        <rect x="72" y="112" width="154" height="168" rx="12" fill="var(--background)" />
        <rect x="242" y="112" width="154" height="168" rx="12" fill="var(--background)" />
        <rect x="412" y="112" width="154" height="168" rx="12" fill="var(--background)" />

        <text x="84" y="132" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="10">BACKLOG</text>
        <text x="254" y="132" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="10">IN PROGRESS</text>
        <text x="424" y="132" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="10">DONE</text>

        <rect x="86" y={backlogY} width="126" height="16" rx="7" fill="var(--card-muted)" />
        <rect x="86" y={backlogY + 22} width="98" height="12" rx="6" fill="var(--card-muted)" />
        <circle cx="202" cy={backlogY + 8} r="5" fill="var(--text-selected)" opacity={blink} />

        <rect x="256" y={progressY} width="126" height="16" rx="7" fill="var(--card-muted)" />
        <rect x="256" y={progressY + 22} width="108" height="12" rx="6" fill="var(--card-muted)" />
        <circle cx="372" cy={progressY + 8} r="5" fill="var(--text-selected)" opacity={blink} />

        <rect x="426" y={doneY} width="126" height="16" rx="7" fill="var(--card-muted)" />
        <rect x="426" y={doneY + 22} width="92" height="12" rx="6" fill="var(--card-muted)" />
        <circle cx="542" cy={doneY + 8} r="5" fill="var(--text-selected)" opacity={blink} />

        <line x1="226" y1={backlogY + 8} x2="242" y2={progressY + 8} stroke="var(--text-selected)" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
        <line x1="396" y1={progressY + 8} x2="412" y2={doneY + 8} stroke="var(--text-selected)" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
      </svg>
    </div>
  );
}
