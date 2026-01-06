"use client";

import { ExamSection } from "@/components/ExamSection";
import { useState } from "react";
import { useEvaluation } from "@/hooks/useEvaluation";
import {
  ResultadoDelExamen,
  type ResultadoTipo,
} from "@/components/admin/ResultadoDelExamen";

interface RevisionProps {
  postulanteId: string;
  revisionId: string;
}

export const Revision = ({ revisionId, postulanteId }: RevisionProps) => {
  const {
    initialResponses,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  } = useEvaluation(postulanteId, revisionId);

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [examObservaciones, setExamObservaciones] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultado, setResultado] = useState<ResultadoTipo>("apto");

  const handleObservacionChange = (examId: string, observacion: string) => {
    setExamObservaciones((prev) => ({
      ...prev,
      [examId]: observacion,
    }));
  };

  const handleFinalize = async () => {
    if (!initialResponses) {
      alert("No se encontró la evaluación.");
      return;
    }

    if (
      !confirm(
        "¿Estás seguro de que quieres finalizar la revisión? Las observaciones serán enviadas.",
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

      // Build the payload with observaciones for each exam
      const examenes = initialResponses.evaluacion.examenes.map((exam) => ({
        examen_id: exam._id,
        observacion: examObservaciones[exam._id] || "",
      }));

      const payload = {
        respuesta_id: initialResponses._id,
        evaluacion_id: initialResponses.evaluacion._id,
        examenes: examenes,
        resultado: resultado,
      };

      const response = await fetch(`${BASE_URL}/revision`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        alert("Revisión finalizada correctamente!");
        window.location.href = "/admin/dashboard/revision";
      } else if (response.status === 403) {
        alert("No tienes permisos para finalizar esta revisión.");
      } else if (response.status === 500) {
        alert(
          "Error del servidor al finalizar la revisión. Por favor, inténtalo de nuevo.",
        );
      } else {
        alert("Error inesperado. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      alert(
        "Error al enviar las observaciones. Por favor, inténtalo de nuevo.",
      );
      console.error("Error submitting revision:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  if (!initialResponses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se encontró la evaluación.</p>
      </div>
    );
  }

  const currentExam = selectedExamId
    ? initialResponses.evaluacion.examenes.find((e) => e._id === selectedExamId)
    : initialResponses.evaluacion.examenes[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sticky Left Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-full z-10">
        <div className="flex flex-col h-full">
          {/* Return Button */}
          <div className="p-4 border-b border-gray-200">
            <a
              href="/admin/dashboard/revision"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a lista de revisiones
            </a>
          </div>

          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Revisión
            </h2>
            <div className="text-sm text-gray-600">
              {initialResponses.evaluacion.nombre}
            </div>
          </div>

          {/* Exams List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Exámenes</h3>
            <div className="space-y-2">
              {initialResponses.evaluacion.examenes.map((exam, index) => {
                const isSelected =
                  selectedExamId === exam._id ||
                  (selectedExamId === null && index === 0);

                return (
                  <button
                    key={exam._id}
                    onClick={() => setSelectedExamId(exam._id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm">
                      Examen {index + 1}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {exam.titulo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <ResultadoDelExamen
            resultado={resultado}
            onResultadoChange={setResultado}
          />

          {/* Finalizar Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleFinalize}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                "Finalizar"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {currentExam && (
            <ExamSection
              exam={currentExam}
              responses={responses}
              onResponseChange={updateResponse}
              postulanteId={postulanteId}
              examNumber={
                initialResponses.evaluacion.examenes.findIndex(
                  (e) => e._id === currentExam._id,
                ) + 1
              }
              disabled
              comment={examObservaciones[currentExam._id] || ""}
              onCommentChange={(observacion) =>
                handleObservacionChange(currentExam._id, observacion)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
