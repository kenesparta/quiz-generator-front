"use client";

import { useRouter } from "next/navigation";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-(--page-bg) flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-(--border-color-light) border-t-(--primary) mx-auto mb-4" />
        <p className="text-(--text-secondary) text-sm">
          Cargando evaluación...
        </p>
      </div>
    </div>
  );
}

export function ErrorScreen({ error }: { error: string }) {
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

export function NoDataScreen() {
  return (
    <div className="min-h-screen bg-(--page-bg) flex items-center justify-center">
      <p className="text-(--text-secondary) text-sm">
        No se encontró la evaluación.
      </p>
    </div>
  );
}

export function SubmittedScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-(--page-bg) flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-(--success-light) mb-4">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-(--success)"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-(--text-primary) mb-2">
            ¡Evaluación Enviada!
          </h3>
          <p className="text-(--text-secondary) text-sm mb-6">
            Tu evaluación ha sido enviada correctamente.
          </p>
          <button
            type="button"
            onClick={() => router.push("/evaluacion")}
            className="bg-(--primary) text-white px-6 py-2.5 rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium cursor-pointer"
          >
            Volver a mis evaluaciones
          </button>
        </div>
      </div>
    </div>
  );
}
