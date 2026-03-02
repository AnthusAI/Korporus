import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settingsSlotTag?: string;
}

function SettingsSlot({ tagName }: { tagName: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = document.createElement(tagName);
    ref.current.innerHTML = "";
    ref.current.appendChild(el);
    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [tagName]);

  return <div ref={ref} className="flex-1 p-4" />;
}

export default function SettingsPanel({ open, onClose, settingsSlotTag }: SettingsPanelProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Settings panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
            Settings
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Close settings panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {settingsSlotTag ? (
            <SettingsSlot tagName={settingsSlotTag} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No settings available</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
