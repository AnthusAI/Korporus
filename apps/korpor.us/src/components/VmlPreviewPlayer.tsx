import * as React from "react";

type VmlPreviewPlayerProps = {
  xmlPath: string;
};

type Cue = {
  id: string;
  label: string;
  voiceLines: string[];
};

type Scene = {
  id: string;
  title: string;
  durationSeconds: number;
  cues: Cue[];
  startSeconds: number;
  endSeconds: number;
};

const parseDurationToSeconds = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.endsWith("ms")) return Number(trimmed.slice(0, -2)) / 1000;
  if (trimmed.endsWith("s")) return Number(trimmed.slice(0, -1));
  if (trimmed.endsWith("f")) return Number(trimmed.slice(0, -1)) / 24;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : 0;
};

const parseScenes = (xml: string): Scene[] => {
  const sceneRegex = /<scene\b([^>]*)>([\s\S]*?)<\/scene>/g;
  const scenes: Scene[] = [];
  let elapsed = 0;

  for (const sceneMatch of xml.matchAll(sceneRegex)) {
    const attrs = sceneMatch[1] ?? "";
    const body = sceneMatch[2] ?? "";

    const id = attrs.match(/\bid="([^"]+)"/)?.[1] ?? "scene";
    const title = attrs.match(/\btitle="([^"]+)"/)?.[1] ?? id;
    const durationRaw = attrs.match(/\bduration="([^"]+)"/)?.[1] ?? "0s";
    const durationSeconds = parseDurationToSeconds(durationRaw);

    const cues: Cue[] = [];
    const cueRegex = /<cue\b([^>]*)>([\s\S]*?)<\/cue>/g;
    for (const cueMatch of body.matchAll(cueRegex)) {
      const cueAttrs = cueMatch[1] ?? "";
      const cueBody = cueMatch[2] ?? "";
      const cueId = cueAttrs.match(/\bid="([^"]+)"/)?.[1] ?? "cue";
      const cueLabel = cueAttrs.match(/\blabel="([^"]+)"/)?.[1] ?? cueId;
      const voiceLines = Array.from(cueBody.matchAll(/<voice>([\s\S]*?)<\/voice>/g))
        .map((m) => m[1].replace(/\s+/g, " ").trim())
        .filter(Boolean);
      cues.push({ id: cueId, label: cueLabel, voiceLines });
    }

    scenes.push({
      id,
      title,
      durationSeconds,
      cues,
      startSeconds: elapsed,
      endSeconds: elapsed + durationSeconds
    });
    elapsed += durationSeconds;
  }

  return scenes;
};

export function VmlPreviewPlayer({ xmlPath }: VmlPreviewPlayerProps) {
  const [xmlContent, setXmlContent] = React.useState<string>("");
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [scenes, setScenes] = React.useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    setXmlContent("");
    setScenes([]);
    setSelectedSceneId(null);
    setCurrentTime(0);
    setIsPlaying(false);

    fetch(`/${xmlPath}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${xmlPath}: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseScenes(text);
        setXmlContent(text);
        setScenes(parsed);
        const total = parsed.reduce((acc, scene) => acc + scene.durationSeconds, 0);
        setDuration(total);
        setSelectedSceneId(parsed[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [xmlPath]);

  React.useEffect(() => {
    if (!isPlaying || duration <= 0) return;
    const stepMs = 1000 / 24;
    const id = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1 / 24;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, stepMs);
    return () => window.clearInterval(id);
  }, [isPlaying, duration]);

  const selectedScene =
    scenes.find((scene) => scene.id === selectedSceneId) ??
    scenes.find((scene) => currentTime >= scene.startSeconds && currentTime <= scene.endSeconds) ??
    null;

  const jumpToScene = (scene: Scene) => {
    setSelectedSceneId(scene.id);
    setCurrentTime(scene.startSeconds);
    setIsPlaying(false);
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loadError) {
    return (
      <div className="w-full h-full min-h-[280px] rounded-xl border border-border/60 bg-card flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm uppercase tracking-wider text-muted font-mono mb-3">Preview Load Error</p>
          <p className="text-sm text-red-400">{loadError}</p>
          <p className="text-xs text-muted/80 mt-3 font-mono">{xmlPath}</p>
        </div>
      </div>
    );
  }

  if (!xmlContent) {
    return (
      <div className="w-full h-full min-h-[280px] rounded-xl border border-border/60 bg-card flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm uppercase tracking-wider text-muted font-mono mb-3">Loading VML Preview</p>
          <p className="text-sm text-muted leading-relaxed">Fetching timeline and cues...</p>
          <p className="text-xs text-muted/80 mt-2 font-mono">{xmlPath}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl border border-border/60 bg-card flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card-muted/40 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted font-mono">VML Authoring Preview</p>
          <p className="text-xs text-muted/80 font-mono">{xmlPath}</p>
        </div>
        <div className="text-xs text-muted font-mono">
          {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] h-full min-h-0">
        <aside className="border-r border-border/50 p-3 overflow-auto bg-background/60">
          <p className="text-[11px] uppercase tracking-wider text-muted font-mono mb-2">Scenes</p>
          <div className="space-y-2">
            {scenes.map((scene) => {
              const active = selectedScene?.id === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => jumpToScene(scene)}
                  className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                    active ? "border-selected bg-selected/10" : "border-border/40 bg-card hover:border-selected/40"
                  }`}
                >
                  <div className="text-xs text-muted font-mono">{scene.id}</div>
                  <div className="text-sm font-semibold text-foreground">{scene.title}</div>
                  <div className="text-xs text-muted mt-1">{scene.durationSeconds.toFixed(1)}s</div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="p-4 flex flex-col min-h-0">
          <div className="rounded-lg border border-border/50 bg-background/70 p-3 mb-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="px-3 py-1.5 rounded-md bg-card border border-border/50 text-sm font-semibold hover:bg-card-muted/50"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentTime((prev) => Math.max(0, prev - 1 / 24))}
                className="px-2 py-1 rounded border border-border/50 text-xs font-mono hover:bg-card-muted/50"
              >
                -1f
              </button>
              <button
                type="button"
                onClick={() => setCurrentTime((prev) => Math.min(duration, prev + 1 / 24))}
                className="px-2 py-1 rounded border border-border/50 text-xs font-mono hover:bg-card-muted/50"
              >
                +1f
              </button>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={Math.max(duration, 0.001)}
                step={1 / 24}
                value={Math.min(currentTime, duration)}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full"
              />
              <div className="mt-1 h-1 rounded bg-border/40 overflow-hidden">
                <div className="h-full bg-selected" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/70 p-4 overflow-auto min-h-0 flex-1">
            {selectedScene ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted font-mono">Selected Scene</p>
                <h4 className="text-lg font-semibold text-foreground">{selectedScene.title}</h4>
                <p className="text-xs text-muted font-mono">
                  {selectedScene.startSeconds.toFixed(1)}s - {selectedScene.endSeconds.toFixed(1)}s
                </p>
                <div className="space-y-3">
                  {selectedScene.cues.map((cue) => (
                    <div key={cue.id} className="rounded-md border border-border/50 bg-card p-3">
                      <p className="text-xs uppercase tracking-wider text-muted font-mono">{cue.label}</p>
                      {cue.voiceLines.length ? (
                        <ul className="mt-2 space-y-2">
                          {cue.voiceLines.map((line, idx) => (
                            <li key={`${cue.id}-${idx}`} className="text-sm text-muted leading-relaxed">
                              {line}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted mt-2">No voice lines in this cue.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">No scene data found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
