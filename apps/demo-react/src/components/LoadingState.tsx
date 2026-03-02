export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
      <p className="text-slate-500 text-sm font-medium">Loading Hello World app…</p>
    </div>
  );
}
