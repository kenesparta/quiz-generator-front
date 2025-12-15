"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvaluaciones } from "@/hooks/useEvaluaciones";
import { usePostulante } from "@/hooks/usePostulante";

const getSubFromJWT = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
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
    useEvaluaciones(postulanteId);

  const handleStartEvaluacion = async (respuestaId: string) => {
    const success = await startEvaluacion(respuestaId);
    if (success) {
      router.push(`/evaluacion/${respuestaId}`);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "creado":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            Pendiente
          </span>
        );
      case "en_progreso":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
            En Progreso
          </span>
        );
      case "completado":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            Completado
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  if (isLoading || postulanteLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg border border-red-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mis Evaluaciones
              </h1>
              {postulante && (
                <p className="text-gray-600 mt-1">
                  Bienvenido, {postulante.nombre}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("expires_in");
                router.push("/login");
              }}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {evaluaciones.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay evaluaciones disponibles
            </h3>
            <p className="text-gray-600">
              No tienes evaluaciones asignadas en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluaciones.map((evaluacion) => (
              <div
                key={evaluacion.respuesta_id}
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {evaluacion.nombre_evaluacion}
                      </h2>
                      {getEstadoBadge(evaluacion.estado)}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {evaluacion.descripcion_evaluacion}
                    </p>
                  </div>
                  <div className="ml-4">
                    {evaluacion.estado === "completado" ? (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Completado
                      </button>
                    ) : evaluacion.estado === "en_progreso" ? (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/evaluacion/${evaluacion.respuesta_id}`)
                        }
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                      >
                        {isStarting ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
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
