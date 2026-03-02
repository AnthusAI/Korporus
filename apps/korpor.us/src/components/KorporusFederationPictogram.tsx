import * as React from "react";
import { type FramePictogramProps, useResolvedFrame, clamp01, pingPong } from "./FramePictogram";

export function KorporusFederationPictogram({ frame, fps = 30, className, style }: FramePictogramProps) {
  const resolvedFrame = useResolvedFrame(frame, fps);

  const seconds = resolvedFrame / fps;
  const cycle = seconds / 6;

  const handoffA = pingPong(cycle) * 100;
  const handoffB = pingPong(cycle + 0.33) * 100;
  const handoffC = pingPong(cycle + 0.66) * 100;

  const glow = clamp01(0.35 + Math.sin(seconds * 1.2) * 0.2);
  const cardShift = Math.sin(seconds * 2) * 20;

  return (
    <div
      className={`w-full h-full bg-card flex items-center justify-center rounded-2xl overflow-hidden pictogram ${className ?? ""}`}
      style={style}
    >
      <svg viewBox="0 0 600 360" width="100%" height="100%" role="img" aria-label="Korporus federation pictogram">
        <defs>
          <radialGradient id="korp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--glow-center)" stopOpacity={glow} />
            <stop offset="100%" stopColor="var(--glow-edge)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="300" cy="180" rx="260" ry="150" fill="url(#korp-glow)" />

        <g transform="translate(90 70)">
          <rect width="170" height="120" rx="12" fill="var(--column)" />
          <rect x="12" y="14" width="146" height="90" rx="8" fill="var(--background)" />
          <rect x={24 + cardShift * 0.15} y="28" width="54" height="18" rx="4" fill="var(--card)" />
          <rect x="24" y="54" width="80" height="14" rx="4" fill="var(--card-muted)" />
          <rect x="24" y="74" width="62" height="14" rx="4" fill="var(--card-muted)" />
          <text x="12" y="136" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">SHELL</text>
        </g>

        <g transform="translate(340 46)">
          <rect width="170" height="120" rx="12" fill="var(--column)" />
          <rect x="12" y="14" width="146" height="90" rx="8" fill="var(--background)" />
          <rect x="24" y="28" width="118" height="14" rx="4" fill="var(--card-muted)" />
          <rect x="24" y="50" width="95" height="14" rx="4" fill="var(--card-muted)" />
          <rect x={40 + cardShift * 0.2} y="72" width="64" height="18" rx="4" fill="var(--text-selected)" />
          <text x="12" y="136" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">REMOTE A</text>
        </g>

        <g transform="translate(300 214)">
          <rect width="170" height="120" rx="12" fill="var(--column)" />
          <rect x="12" y="14" width="146" height="90" rx="8" fill="var(--background)" />
          <rect x="24" y="28" width="90" height="14" rx="4" fill="var(--card-muted)" />
          <rect x="24" y="50" width="112" height="14" rx="4" fill="var(--card-muted)" />
          <rect x={30 - cardShift * 0.18} y="72" width="70" height="18" rx="4" fill="var(--text-selected)" />
          <text x="12" y="136" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">REMOTE B</text>
        </g>

        <g transform="translate(112 214)">
          <rect width="170" height="120" rx="12" fill="var(--column)" />
          <rect x="12" y="14" width="146" height="90" rx="8" fill="var(--background)" />
          <rect x="24" y="28" width="76" height="14" rx="4" fill="var(--card-muted)" />
          <rect x="24" y="50" width="116" height="14" rx="4" fill="var(--card-muted)" />
          <rect x={44 + cardShift * 0.25} y="72" width="56" height="18" rx="4" fill="var(--text-selected)" />
          <text x="12" y="136" fill="var(--text-muted)" fontSize="12" fontFamily="var(--font-mono)">REMOTE C</text>
        </g>

        <line x1="260" y1="126" x2="340" y2="106" stroke="var(--text-selected)" strokeDasharray="6 6" strokeWidth="2" opacity={0.4 + handoffA / 220} />
        <line x1="226" y1="184" x2="300" y2="246" stroke="var(--text-selected)" strokeDasharray="6 6" strokeWidth="2" opacity={0.4 + handoffB / 220} />
        <line x1="248" y1="194" x2="170" y2="244" stroke="var(--text-selected)" strokeDasharray="6 6" strokeWidth="2" opacity={0.4 + handoffC / 220} />

        <circle cx={260 + handoffA * 0.8} cy={126 - handoffA * 0.2} r="6" fill="var(--text-selected)" />
        <circle cx={226 + handoffB * 0.74} cy={184 + handoffB * 0.62} r="6" fill="var(--text-selected)" />
        <circle cx={248 - handoffC * 0.78} cy={194 + handoffC * 0.5} r="6" fill="var(--text-selected)" />
      </svg>
    </div>
  );
}
