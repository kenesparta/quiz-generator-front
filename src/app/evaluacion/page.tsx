"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useListaEvaluaciones } from "@/hooks/useListaEvaluaciones";
import { usePostulante } from "@/hooks/usePostulante";
import { getSubFromJWT } from "@/utils/jwt";

const getEstadoDot = (estado: string) => {
  const config: Record<string, { color: string; label: string }> = {
    creado: { color: "bg-(--primary)", label: "Pendiente" },
    en_progreso: { color: "bg-(--warning)", label: "En Progreso" },
    completado: { color: "bg-(--success)", label: "Completado" },
  };
  const { color, label } = config[estado] || {
    color: "bg-(--neutral-400)",
    label: estado,
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-(--text-secondary)">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
};

export default function EvaluacionesPage() {
  const router = useRouter();
  const [postulanteId, setPostulanteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = getSubFromJWT(token);
    if (!id) {
      router.push("/login");
      return;
    }
    setPostulanteId(id);
  }, [router]);

  const { postulante, isLoading: postulanteLoading } =
    usePostulante(postulanteId);
  const { evaluaciones, isLoading, error, startEvaluacion, isStarting } =
    useListaEvaluaciones(postulanteId);

  const handleStartEvaluacion = async (respuestaId: string) => {
    const success = await startEvaluacion(respuestaId);
    if (success) {
      router.push(`/evaluacion/${respuestaId}`);
    }
  };

  if (isLoading || postulanteLoading) {
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

  if (error) {
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
              className="bg-(--primary) text-white px-4 py-2 rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--page-bg)">
      {/* Top Bar */}
      <header className="bg-(--sidebar-bg) text-white">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-(--primary) flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12l-2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Mis Evaluaciones</h1>
                {postulante && (
                  <p className="text-white/60 text-sm">
                    Bienvenido, {postulante.nombre}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("expires_in");
                router.push("/login");
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {evaluaciones.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            {evaluaciones.map((evaluacion) => (
              <div
                key={evaluacion.respuesta_id}
                className="bg-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-(--primary-light) flex items-center justify-center text-(--primary) shrink-0 mt-0.5">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        <path d="M9 14l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-base font-semibold text-(--text-primary)">
                          {evaluacion.nombre_evaluacion}
                        </h2>
                        {getEstadoDot(evaluacion.estado)}
                      </div>
                      <p className="text-sm text-(--text-tertiary)">
                        {evaluacion.descripcion_evaluacion}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    {evaluacion.estado === "completado" ? (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 bg-(--neutral-100) text-(--text-tertiary) rounded-md cursor-not-allowed text-sm"
                      >
                        Completado
                      </button>
                    ) : evaluacion.estado === "en_progreso" ? (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/evaluacion/${evaluacion.respuesta_id}`)
                        }
                        className="px-4 py-2 bg-white border border-(--warning) text-(--warning-text) rounded-md hover:bg-(--warning-light) transition-colors text-sm font-medium"
                      >
                        Continuar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEvaluacion(evaluacion.respuesta_id)
                        }
                        disabled={isStarting}
                        className="px-4 py-2 bg-(--primary) text-white rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isStarting ? (
                          <span className="flex items-center">
                            <svg
                              aria-hidden="true"
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Iniciando...
                          </span>
                        ) : (
                          "Iniciar"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
