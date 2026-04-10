interface ErrorCardProps {
  error: string;
}

export function ErrorCard({ error }: ErrorCardProps) {
  return (
    <div className="min-h-screen bg-(--page-bg) flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-(--danger-light) mb-4">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-(--danger)"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-(--text-primary) mb-2">
            Error
          </h3>
          <p className="text-(--text-secondary) text-sm mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-(--primary) text-white px-4 py-2 rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
