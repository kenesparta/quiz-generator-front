"use client";

import { useEvaluation } from "@/hooks/useEvaluation";
import { ExamSection } from "@/components/ExamSection";
import { EvaluationProgress } from "@/components/EvaluationProgress";
import { useState } from "react";

export default function EvaluationPage() {
  const {
    evaluation,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  } = useEvaluation();

  const [submitted, setSubmitted] = useState(false);

  const getTotalQuestions = () => {
    return (
      evaluation?.evaluacion.examenes.reduce(
        (total, exam) => total + exam.preguntas.length,
        0,
      ) || 0
    );
  };

  const getTotalAnswered = () => {
    return Object.values(responses).filter(
      (response) => response && response.length > 0,
    ).length;
  };

  const handleSubmit = async () => {
    if (getTotalAnswered() < getTotalQuestions()) {
      if (
        !confirm(
          "Aún tienes preguntas sin responder. ¿Estás seguro de que quieres enviar la evaluación?",
        )
      ) {
        return;
      }
    }

    try {
      await submitEvaluation();
      setSubmitted(true);
      alert("¡Evaluación enviada correctamente!");
    } catch (err) {
      alert("Error al enviar la evaluación. Por favor, inténtalo de nuevo.");
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

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se encontró la evaluación.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Evaluación Enviada!
            </h3>
            <p className="text-gray-600">
              Tu evaluación ha sido enviada correctamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EvaluationProgress
          totalQuestions={getTotalQuestions()}
          answeredQuestions={getTotalAnswered()}
          evaluationName={evaluation.evaluacion.nombre}
          startTime={evaluation.fecha_tiempo_inicio}
        />

        {evaluation.evaluacion.examenes.map((exam, index) => (
          <ExamSection
            key={exam._id}
            exam={exam}
            responses={responses}
            onResponseChange={updateResponse}
            examNumber={index + 1}
          />
        ))}

        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              "Enviar Evaluación"
            )}
          </button>

          {getTotalAnswered() < getTotalQuestions() && (
            <p className="text-sm text-gray-500 mt-2">
              Tienes {getTotalQuestions() - getTotalAnswered()} preguntas sin
              responder
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
