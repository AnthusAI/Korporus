import { useEffect, useRef } from "react";

/** Renders a single Web Component slot by creating the element and appending it to a div ref. */
function SlotContainer({
  tagName,
  className,
}: {
  tagName: string;
  className?: string;
}) {
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

  return <div ref={ref} className={className} />;
}

/**
 * Renders the three Hello app custom element slots:
 *   - hello-app-titlebar
 *   - hello-app-main
 *   - hello-app-settings
 */
export default function HelloAppSlots() {
  return (
    <div className="flex flex-col gap-6">
      {/* Titlebar section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Titlebar
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SlotContainer tagName="hello-app-titlebar" className="min-h-12" />
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
          Settings Panel
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SlotContainer tagName="hello-app-settings" className="min-h-40" />
        </div>
      </section>
    </div>
  );
}
