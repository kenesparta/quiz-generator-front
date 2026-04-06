"use client";

import Link from "next/link";
import { useState } from "react";
import { useRevision } from "@/hooks/admin/useRevision";
import { generatePDFReport } from "@/utils/pdfReportGenerator";

const getEstadoDot = (estado: string) => {
  const config: Record<string, { color: string; label: string }> = {
    sin_iniciar: { color: "bg-(--neutral-400)", label: "Sin Iniciar" },
    en_proceso: { color: "bg-(--warning)", label: "En Proceso" },
    finalizada: { color: "bg-(--success)", label: "Finalizada" },
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

export default function RevisionPage() {
  const { revisions, isLoading, error } = useRevision();
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  const handleGeneratePDF = async (
    revisionId: string,
    postulanteId: string,
    postulante?: { documento: string; nombre: string },
  ) => {
    setGeneratingPDF(postulanteId);
    try {
      await generatePDFReport(revisionId, postulanteId, postulante);
    } finally {
      setGeneratingPDF(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Lista de Evaluaciones
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) p-6">
          <p className="text-(--text-secondary)">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Lista de Evaluaciones
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) p-6">
          <p className="text-(--danger)">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-(--text-primary)">
              Lista de Evaluaciones
            </h1>
            {revisions.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-(--table-header-bg) text-(--text-secondary) rounded-full">
                {revisions.length}
              </span>
            )}
          </div>
          <p className="text-sm text-(--text-tertiary) mt-1">
            Selecciona una evaluación para revisar las respuestas de los
            postulantes.
          </p>
        </div>
      </div>

      {/* Revision List */}
      {revisions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) text-center py-12">
          <svg
            aria-hidden="true"
            className="w-12 h-12 text-(--neutral-300) mx-auto mb-3"
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
          <p className="text-(--text-tertiary) text-sm">
            No hay evaluaciones disponibles para revisar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {revisions.map((revision) => {
            const isFinalized = revision.estado_revision === "finalizada";
            return (
              <div
                key={revision.postulante_id}
                className="bg-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) hover:shadow-md transition-shadow"
              >
                {/* Top row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-(--primary-light) flex items-center justify-center text-(--primary) shrink-0">
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
                    <div>
                      <h3 className="font-semibold text-(--text-primary)">
                        {revision.nombre_evaluacion}
                      </h3>
                      {getEstadoDot(revision.estado_revision)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleGeneratePDF(
                          revision.revision_id,
                          revision.postulante_id,
                          revision.postulante,
                        )
                      }
                      disabled={generatingPDF === revision.postulante_id}
                      className="px-3 py-1.5 bg-white border border-(--border-color) text-(--text-primary) rounded-md hover:border-(--primary) hover:text-(--primary) transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {generatingPDF === revision.postulante_id
                        ? "Generando..."
                        : "PDF"}
                    </button>
                    {isFinalized ? (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1.5 bg-(--neutral-100) text-(--text-tertiary) rounded-md cursor-not-allowed text-sm"
                      >
                        Revisar
                      </button>
                    ) : (
                      <Link
                        href={`/admin/dashboard/revision/${revision.revision_id}/${revision.postulante_id}`}
                        className="px-3 py-1.5 bg-(--primary) text-white rounded-md hover:bg-(--primary-dark) transition-colors text-sm"
                      >
                        Revisar
                      </Link>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-(--text-tertiary) mt-2">
                  {revision.descripcion_evaluacion}
                </p>

                {/* Postulante info */}
                {revision.postulante && (
                  <div className="flex gap-4 text-sm mt-3 pt-3 border-t border-(--border-color-light)">
                    <span className="flex items-center gap-1.5 text-(--text-secondary)">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-(--text-tertiary)"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {revision.postulante.nombre}
                    </span>
                    <span className="flex items-center gap-1.5 text-(--text-secondary)">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-(--text-tertiary)"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                        />
                      </svg>
                      {revision.postulante.documento}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
