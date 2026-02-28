import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { useRegistry } from "../store/registry.js";

export default function Home() {
  const navigate = useNavigate();
  const { apps, loaded } = useRegistry();

  return (
    <main className="flex-1 bg-gray-50 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Your Apps</h1>

        {!loaded && (
          <p className="text-gray-400 text-sm">Loading apps…</p>
        )}

        {loaded && apps.length === 0 && (
          <p className="text-gray-400 text-sm">No apps installed.</p>
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
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md overflow-hidden",
                  "group-hover:scale-105 group-hover:shadow-lg transition-all duration-150",
                  "group-active:scale-95 bg-gray-200",
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
              <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
