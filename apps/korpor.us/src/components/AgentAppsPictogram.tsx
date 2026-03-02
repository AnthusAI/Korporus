import * as React from "react";
import { type FramePictogramProps, clamp01, pingPong, useResolvedFrame } from "./FramePictogram";

export function AgentAppsPictogram({ frame, fps = 30, className, style }: FramePictogramProps) {
  const resolvedFrame = useResolvedFrame(frame, fps);
  const seconds = resolvedFrame / fps;
  const cycle = seconds / 5;
  const pulseA = pingPong(cycle);
  const pulseB = pingPong(cycle + 0.33);
  const pulseC = pingPong(cycle + 0.66);
  const focusX = 190 + pulseA * 210;
  const glow = clamp01(0.32 + Math.sin(seconds * 1.4) * 0.2);

  return (
    <div className={`w-full min-h-[300px] rounded-2xl overflow-hidden bg-card ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 640 340" width="100%" height="100%" role="img" aria-label="Agent apps operating system pictogram">
        <defs>
          <radialGradient id="apps-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--glow-center)" stopOpacity={glow} />
            <stop offset="100%" stopColor="var(--glow-edge)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="640" height="340" fill="var(--background)" />
        <ellipse cx="320" cy="170" rx="270" ry="150" fill="url(#apps-glow)" />

        <rect x="80" y="44" width="480" height="254" rx="18" fill="var(--column)" />
        <rect x="94" y="60" width="452" height="44" rx="12" fill="var(--card)" />
        <circle cx={focusX} cy="82" r="7" fill="var(--text-selected)" />
        <rect x="126" y="73" width="84" height="18" rx="7" fill="var(--card-muted)" />
        <rect x="222" y="73" width="112" height="18" rx="7" fill="var(--card-muted)" />
        <rect x="348" y="73" width="82" height="18" rx="7" fill="var(--card-muted)" />

        <rect x="104" y="122" width="132" height="74" rx="12" fill="var(--background)" />
        <rect x="254" y="122" width="132" height="74" rx="12" fill="var(--background)" />
        <rect x="404" y="122" width="132" height="74" rx="12" fill="var(--background)" />

        <rect x="104" y="210" width="132" height="74" rx="12" fill="var(--background)" />
        <rect x="254" y="210" width="132" height="74" rx="12" fill="var(--background)" />
        <rect x="404" y="210" width="132" height="74" rx="12" fill="var(--background)" />

        <rect x="120" y={138 - pulseA * 3} width="58" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="120" y={158 - pulseA * 2} width="90" height="10" rx="5" fill="var(--card-muted)" />
        <circle cx="214" cy="167" r={5 + pulseA * 1.2} fill="var(--text-selected)" />

        <rect x="270" y={138 - pulseB * 3} width="58" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="270" y={158 - pulseB * 2} width="90" height="10" rx="5" fill="var(--card-muted)" />
        <circle cx="364" cy="167" r={5 + pulseB * 1.2} fill="var(--text-selected)" />

        <rect x="420" y={138 - pulseC * 3} width="58" height="12" rx="6" fill="var(--card-muted)" />
        <rect x="420" y={158 - pulseC * 2} width="90" height="10" rx="5" fill="var(--card-muted)" />
        <circle cx="514" cy="167" r={5 + pulseC * 1.2} fill="var(--text-selected)" />

        <text x="106" y="272" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="11">HOME</text>
        <text x="256" y="272" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="11">MAIN</text>
        <text x="406" y="272" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="11">SETTINGS</text>
      </svg>
    </div>
  );
}
