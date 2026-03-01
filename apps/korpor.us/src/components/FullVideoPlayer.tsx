import * as React from "react";

type FullVideoPlayerProps = {
  src?: string;
  poster?: string;
  className?: string;
  videoId?: string;
};

export function FullVideoPlayer({ src, poster, className = "", videoId }: FullVideoPlayerProps) {
  const [videoFailed, setVideoFailed] = React.useState(false);
  const hasSource = Boolean(src);
  const showVideo = hasSource && !videoFailed;

  return (
    <div
      className={`relative w-full aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-[var(--border)] ${className}`}
    >
      {showVideo ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover"
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-card text-center p-8">
          <p className="text-sm uppercase tracking-wider text-muted font-mono mb-3">Intro Video Draft</p>
          <p className="text-muted max-w-xl">
            The final Korporus intro video is a separate project scope. This draft page preserves layout,
            transitions, and media behavior while using placeholder content.
          </p>
          {videoId ? <p className="text-xs text-muted/80 mt-3 font-mono">video id: {videoId}</p> : null}
        </div>
      )}
    </div>
  );
}
