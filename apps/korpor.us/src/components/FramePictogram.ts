import * as React from "react";

export type FramePictogramProps = {
  frame?: number;
  fps?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function useResolvedFrame(frame: number | undefined, fps: number): number {
  const [liveFrame, setLiveFrame] = React.useState(0);

  React.useEffect(() => {
    if (typeof frame === "number") {
      return;
    }

    let raf = 0;
    let last = performance.now();
    let carry = 0;
    const frameMs = 1000 / fps;

    const loop = (now: number) => {
      const delta = now - last;
      last = now;
      carry += delta;
      if (carry >= frameMs) {
        const advance = Math.floor(carry / frameMs);
        carry -= advance * frameMs;
        setLiveFrame((prev) => prev + advance);
      }
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [frame, fps]);

  return typeof frame === "number" ? frame : liveFrame;
}

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const pingPong = (t: number): number => {
  const looped = t % 1;
  return looped < 0.5 ? looped * 2 : (1 - looped) * 2;
};
