export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-(--page-bg) flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-(--border-color-light) border-t-(--primary) mx-auto mb-4" />
        <p className="text-(--text-secondary) text-sm">
          Cargando evaluaciones...
        </p>
      </div>
    </div>
  );
}
