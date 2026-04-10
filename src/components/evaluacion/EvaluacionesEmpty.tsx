export function EvaluacionesEmpty() {
  return (
    <div className="bg-white rounded-lg p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
      <svg
        aria-hidden="true"
        className="w-12 h-12 text-(--neutral-300) mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-base font-semibold text-(--text-primary) mb-1">
        No hay evaluaciones disponibles
      </h3>
      <p className="text-sm text-(--text-tertiary)">
        No tienes evaluaciones asignadas en este momento.
      </p>
    </div>
  );
}
