import * as React from "react";
import { VmlPreviewPlayer } from "./VmlPreviewPlayer";

type FullVideoPlayerProps = {
  src?: string;
  poster?: string;
  className?: string;
  videoId?: string;
};

export function FullVideoPlayer({ src, poster, className = "", videoId }: FullVideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("preview")) {
        setIsPreviewMode(true);
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const hasSource = Boolean(src);
  const showVideo = hasSource && !videoFailed;

  if (isClient && isPreviewMode && videoId) {
    const xmlPath = `content/${videoId}.babulus.xml`;
    return (
      <div className={`relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-[var(--border)] aspect-video ${className}`}>
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          <div className="px-3 py-1.5 bg-yellow-500/90 text-yellow-950 text-xs font-bold rounded-md backdrop-blur-md shadow-sm">
            VML Preview
          </div>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="px-3 py-1.5 bg-card/90 text-foreground text-xs font-semibold rounded-md backdrop-blur-md border border-border hover:bg-card transition-colors shadow-sm"
          >
            Exit Preview
          </button>
        </div>
        <VmlPreviewPlayer xmlPath={xmlPath} />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-[var(--border)] group ${className}`}
    >
      {videoId && process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewMode(true);
            }}
            className="px-3 py-1.5 bg-card/80 text-foreground text-xs font-semibold rounded-md backdrop-blur-md border border-border hover:bg-card transition-colors shadow-sm"
          >
            Switch to Preview
          </button>
        </div>
      )}
      {showVideo ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover"
          onError={() => setVideoFailed(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
      ) : (
        <div className="w-full h-full relative flex items-center justify-center bg-card text-center">
          {poster ? (
            <img src={poster} alt="Video poster" className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
          {!poster && videoId ? <p className="relative z-10 text-xs text-muted/80 font-mono">video id: {videoId}</p> : null}
        </div>
      )}
    </div>
  );
}
