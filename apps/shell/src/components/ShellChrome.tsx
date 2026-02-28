import { Home, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

interface ShellChromeProps {
  appName?: string;
  onToggleSettings?: () => void;
  settingsOpen?: boolean;
}

export default function ShellChrome({
  appName,
  onToggleSettings,
  settingsOpen,
}: ShellChromeProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-4 h-12 flex-shrink-0 shadow-lg">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg tracking-tight text-white">
          Korporus
        </span>
        {appName && (
          <>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300 text-sm">{appName}</span>
          </>
        )}
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        {appName && onToggleSettings && (
          <button
            onClick={onToggleSettings}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              settingsOpen
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            )}
            aria-label="Toggle settings panel"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Go home"
          title="Home"
        >
          <Home size={18} />
        </button>
      </div>
    </header>
  );
}
