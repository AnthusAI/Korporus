interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
      {/* Warning icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
        <svg
          className="h-7 w-7 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <p className="text-slate-800 font-semibold text-base">
          The Korporus container is starting up.
        </p>
        <p className="text-slate-500 text-sm max-w-md">
          This usually takes 10–30 seconds. The Hello World app will be available shortly. Please
          wait and try again.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="mt-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
