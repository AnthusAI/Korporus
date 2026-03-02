import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { useRegistry } from "../store/registry.js";

export default function Home() {
  const navigate = useNavigate();
  const { apps, loaded } = useRegistry();

  return (
    <main className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-2xl font-semibold text-foreground">Your Apps</h1>

        {!loaded && (
          <p className="text-sm text-muted-foreground">Loading apps…</p>
        )}

        {loaded && apps.length === 0 && (
          <p className="text-sm text-muted-foreground">No apps installed.</p>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(`/app/${app.id}`)}
              className={cn("flex flex-col items-center gap-2 group focus:outline-none")}
              aria-label={`Open ${app.name}`}
            >
              <div
                className={cn(
                  "h-16 w-16 overflow-hidden rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm",
                  "group-hover:scale-105 group-hover:shadow transition-all duration-150",
                  "group-active:scale-95",
                )}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-center text-xs font-medium leading-tight text-foreground">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
