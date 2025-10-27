"use client";

import { useEvaluation } from "@/hooks/useEvaluation";
import { ExamSection } from "@/components/ExamSection";
import { useState, useEffect } from "react";
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

export default function EvaluationPage() {
  const [postulanteId, setPostulanteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = getSubFromJWT(token);
    setPostulanteId(id);
  }, []);

  const {
    postulante,
    isLoading: postulanteLoading,
    error: postulanteError,
  } = usePostulante(postulanteId);

  const {
    initialResponses,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  } = useEvaluation(postulanteId);

  const [submitted, setSubmitted] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (initialResponses?.fecha_tiempo_transcurrido) {
      setElapsedTime(initialResponses.fecha_tiempo_transcurrido * 1000);
    }
  }, [initialResponses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const FancyClockSVG = () => {
    const time = formatTime(elapsedTime);

    return (
      <div className="flex items-center space-x-1 font-mono font-bold">
        <div className="flex items-center space-x-0.5">
          <span className="bg-blue-700 text-white px-1.5 py-0.5 rounded">
            {time.hours}
          </span>
          <span className="text-blue-600 animate-pulse">:</span>
          <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded">
            {time.minutes}
          </span>
          <span className="text-blue-600 animate-pulse">:</span>
          <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded">
            {time.seconds}
          </span>
        </div>
      </div>
    );
  };

  const getTotalQuestions = () => {
    return (
      initialResponses?.evaluacion.examenes.reduce(
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

  const getExamProgress = (examId: string) => {
    const exam = initialResponses?.evaluacion.examenes.find(
      (e) => e._id === examId,
    );
    if (!exam) return { answered: 0, total: 0 };

    const answered = exam.preguntas.filter(
      (q) => responses[q._id] && responses[q._id].length > 0,
    ).length;
    return { answered, total: exam.preguntas.length };
  };

  const handleSubmitExam = async (examId: string) => {
    const exam = initialResponses?.evaluacion.examenes.find(
      (e) => e._id === examId,
    );
    if (!exam) return;

    const { answered, total } = getExamProgress(examId);

    if (answered < total) {
      if (
        !confirm(
          `Tienes ${total - answered} preguntas sin responder en este examen. ¿Estás seguro de que quieres enviarlo?`,
        )
      ) {
        return;
      }
    }

    alert(`Examen "${exam.titulo}" enviado correctamente!`);
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
      await submitEvaluation(postulanteId);
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

  if (!initialResponses) {
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

  const currentExam = selectedExamId
    ? initialResponses.evaluacion.examenes.find((e) => e._id === selectedExamId)
    : initialResponses.evaluacion.examenes[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-full z-10">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {initialResponses.evaluacion.nombre}
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Postulante:</span>
                <span className="ml-2 text-gray-900">{postulante?.nombre}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">DNI:</span>
                <span className="ml-2 text-gray-900">
                  {postulante?.documento}
                </span>
              </div>
              <div>
                <span className="text-blue-800 rounded-full text-xl">
                  <FancyClockSVG />
                </span>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de preguntas:</span>
                <span className="font-medium">{getTotalQuestions()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Respondidas:</span>
                <span className="font-medium text-green-600">
                  {getTotalAnswered()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendientes:</span>
                <span className="font-medium text-orange-600">
                  {getTotalQuestions() - getTotalAnswered()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${getTotalQuestions() > 0 ? (getTotalAnswered() / getTotalQuestions()) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                {getTotalQuestions() > 0
                  ? Math.round((getTotalAnswered() / getTotalQuestions()) * 100)
                  : 0}
                % completado
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Exámenes</h3>
              <div className="space-y-3">
                {initialResponses.evaluacion.examenes.map((exam, index) => {
                  const progress = getExamProgress(exam._id);
                  const isSelected =
                    selectedExamId === exam._id ||
                    (selectedExamId === null && index === 0);

                  return (
                    <div
                      key={exam._id}
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedExamId(exam._id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 leading-tight">
                          {exam.titulo}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            progress.answered === progress.total
                              ? "bg-green-100 text-green-800"
                              : progress.answered > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {progress.answered}/{progress.total}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress.total > 0 ? (progress.answered / progress.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar Evaluación"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex-1 ml-80 overflow-y-auto">
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
