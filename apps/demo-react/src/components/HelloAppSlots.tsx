import { useEffect, useRef } from "react";

function resolveTitlebarTagName(): string {
  if (customElements.get("hello-app-titlebar")) {
    return "hello-app-titlebar";
  }
  return "hello-app-menubar";
}

/** Renders a single Web Component slot by creating the element and appending it to a div ref. */
function SlotContainer({
  tagName,
  className,
  onElement,
}: {
  tagName: string;
  className?: string;
  onElement?: (el: HTMLElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = document.createElement(tagName);
    el.style.display = "block";
    el.style.width = "100%";
    ref.current.innerHTML = "";
    ref.current.appendChild(el);
    onElement?.(el);
    return () => {
      onElement?.(null);
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [tagName]);

  return <div ref={ref} className={className} />;
}

/**
 * Renders the Hello app custom element slots:
 *   - hello-app-menubar
 *   - hello-app-main
 */
export default function HelloAppSlots() {
  const titlebarTagName = resolveTitlebarTagName();
  const settingsElRef = useRef<HTMLElement | null>(null);

  const dispatchSettingsEvent = (eventName: string) => {
    settingsElRef.current?.dispatchEvent(
      new CustomEvent(eventName, { bubbles: true, composed: true }),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Menubar section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Menu Bar
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SlotContainer tagName={titlebarTagName} className="min-h-12 p-3" />
        </div>
      </section>

      {/* Main content section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Main Content
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SlotContainer tagName="hello-app-main" className="min-h-64 flex items-center justify-center" />
        </div>
      </section>

      {/* Settings section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Settings
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SlotContainer
            tagName="hello-app-settings"
            className="min-h-72 p-3"
            onElement={(el) => { settingsElRef.current = el; }}
          />
          <div className="flex justify-end px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => dispatchSettingsEvent("korporus:settings:save")}
              className="px-4 py-1.5 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
