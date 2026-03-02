import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Settings2 } from "lucide-react";

interface ShellChromeProps {
  appName?: string;
  menubarSlotTag?: string;
}

function MenubarSlot({ tagName }: { tagName: string }) {
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

  return <div ref={ref} className="flex min-w-0 items-center" />;
}

export default function ShellChrome({ appName, menubarSlotTag }: ShellChromeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="relative z-30 flex h-10 items-center border-b border-border bg-card/95 px-3 backdrop-blur-sm">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Open app menu"
          title="App menu"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
        </button>
        {menuOpen && (
          <div className="absolute left-0 top-9 min-w-44 overflow-hidden rounded-md border border-border bg-card p-1 shadow-md">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              <Home size={14} />
              Home
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/settings-app")}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              <Settings2 size={14} />
              Settings
            </button>
          </div>
        )}
      </div>

      <div className="ml-2 flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium text-foreground/80">
          {appName ?? "Korporus"}
        </span>
        {menubarSlotTag && (
          <>
            <span className="text-muted-foreground">•</span>
            <div className="min-w-0 flex-1">
              <MenubarSlot tagName={menubarSlotTag} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
