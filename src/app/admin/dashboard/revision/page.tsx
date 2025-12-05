"use client";

import Link from "next/link";
import { useRevision } from "@/hooks/admin/useRevision";

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "sin_iniciar":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
          Sin Iniciar
        </span>
      );
    case "en_proceso":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
          En Proceso
        </span>
      );
    case "finalizada":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
          Finalizada
        </span>
      );
    default:
      return null;
  }
};

export default function RevisionPage() {
  const { revisions, isLoading, error } = useRevision();

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Lista de Evaluaciones
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Lista de Evaluaciones
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Lista de Evaluaciones
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          Selecciona una evaluación para revisar las respuestas de los
          postulantes.
        </p>
        {revisions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay evaluaciones disponibles para revisar
          </p>
        ) : (
          <div className="space-y-4">
            {revisions.map((revision) => {
              const isFinalized = revision.estado_revision === "finalizada";
              return (
                <div
                  key={revision.postulante_id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {revision.nombre_evaluacion}
                        </h3>
                        {getEstadoBadge(revision.estado_revision)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {revision.descripcion_evaluacion}
                      </p>
                      {revision.postulante && (
                        <div className="flex gap-4 text-sm mt-3">
                          <span className="text-gray-700">
                            <span className="font-medium">Postulante:</span>{" "}
                            {revision.postulante.nombre}
                          </span>
                          <span className="text-gray-700">
                            <span className="font-medium">Documento:</span>{" "}
                            {revision.postulante.documento}
                          </span>
                        </div>
                      )}
                    </div>
                    {isFinalized ? (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                      >
                        Revisar
                      </button>
                    ) : (
                      <Link
                        href={`/admin/dashboard/revision/${revision.postulante_id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Revisar
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
