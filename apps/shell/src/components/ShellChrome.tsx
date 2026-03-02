import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Info, Settings2 } from "lucide-react";
import type { AppManifest } from "@korporus/app-manifest";

interface ShellChromeProps {
  appManifest?: AppManifest;
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

export default function ShellChrome({ appManifest, menubarSlotTag }: ShellChromeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutTitle, setAboutTitle] = useState("About this Korporus");
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const appMenuRef = useRef<HTMLDivElement>(null);

  const appMenuLabel = useMemo(() => {
    if (!appManifest) return "";
    const firstWord = appManifest.name.trim().split(/\s+/)[0];
    return firstWord || appManifest.name;
  }, [appManifest]);

  useEffect(() => {
    setSystemMenuOpen(false);
    setAppMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (systemMenuRef.current && !systemMenuRef.current.contains(target)) {
        setSystemMenuOpen(false);
      }
      if (appMenuRef.current && !appMenuRef.current.contains(target)) {
        setAppMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <>
      <header className="relative z-30 flex h-10 items-center border-b border-border bg-card/95 px-3 backdrop-blur-sm">
        <div className="relative" ref={systemMenuRef}>
          <button
            type="button"
            onClick={() => setSystemMenuOpen((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Open Korporus menu"
            title="Korporus"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
          </button>
          {systemMenuOpen && (
            <div className="absolute left-0 top-9 min-w-52 overflow-hidden rounded-md border border-border bg-card p-1 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setAboutTitle("About this Korporus");
                  setAboutOpen(true);
                  setSystemMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <Info size={14} />
                About this Korporus
              </button>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  navigate("/app/settings-app");
                  setSystemMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <Settings2 size={14} />
                System Settings
              </button>
            </div>
          )}
        </div>

        {appManifest && (
          <div className="relative ml-1" ref={appMenuRef}>
            <button
              type="button"
              onClick={() => setAppMenuOpen((prev) => !prev)}
              className="rounded-md px-2 py-1 text-sm font-medium hover:bg-muted"
              aria-label={`Open ${appMenuLabel} menu`}
              title={`${appMenuLabel} menu`}
            >
              {appMenuLabel}
            </button>
            {appMenuOpen && (
              <div className="absolute left-0 top-9 min-w-44 overflow-hidden rounded-md border border-border bg-card p-1 shadow-md">
                <button
                  type="button"
                  onClick={() => {
                    setAboutTitle(`About ${appMenuLabel}`);
                    setAboutOpen(true);
                    setAppMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  <Info size={14} />
                  About {appMenuLabel}
                </button>
                {appManifest.slots.settings && (
                  <>
                    <div className="my-1 h-px bg-border" />
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/app/${appManifest.id}/settings`);
                        setAppMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      <Settings2 size={14} />
                      Settings
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="ml-2 flex min-w-0 flex-1 items-center gap-2">
          {menubarSlotTag && (
            <div className="min-w-0 flex-1">
              <MenubarSlot tagName={menubarSlotTag} />
            </div>
          )}
        </div>
      </header>

      {aboutOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setAboutOpen(false)}
          aria-label="Close about dialog overlay"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={aboutTitle}
            className="absolute left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-5 text-left shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-foreground">{aboutTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {aboutTitle === "About this Korporus"
                ? "Korporus Shell hosts modular apps through the shared menubar and slot contract."
                : `${appManifest?.name ?? "This app"} is running inside the Korporus shell.`}
            </p>
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
            >
              Close
            </button>
          </div>
        </button>
      )}
    </>
  );
}
