"use client";

import { use, useEffect, useState } from "react";
import { ExamSection } from "@/components/ExamSection";
import { usePostulante } from "@/hooks/usePostulante";
import { useRespuestaEvaluacion } from "@/hooks/useRespuestaEvaluacion";

interface PageProps {
  params: Promise<{
    respuestaId: string;
  }>;
}

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

export default function EvaluationPage({ params }: PageProps) {
  const { respuestaId } = use(params);
  const [postulanteId, setPostulanteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = getSubFromJWT(token);
    setPostulanteId(id);
  }, []);

  const { postulante, isLoading: postulanteLoading } =
    usePostulante(postulanteId);

  const {
    initialResponses,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  } = useRespuestaEvaluacion(postulanteId, respuestaId);

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
      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <svg
            aria-hidden="true"
            className="w-4 h-4 text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
          <span className="text-xs text-white/70 font-medium">Tiempo transcurrido</span>
        </div>
        <div className="flex items-center justify-center gap-2 font-mono">
          <div className="text-center">
            <span className="block bg-[var(--primary)] text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
              {time.hours}
            </span>
            <span className="text-[10px] text-white/50 mt-1 block">HRS</span>
          </div>
          <span className="text-white/60 text-lg font-bold pb-4">:</span>
          <div className="text-center">
            <span className="block bg-[var(--primary)] text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
              {time.minutes}
            </span>
            <span className="text-[10px] text-white/50 mt-1 block">MIN</span>
          </div>
          <span className="text-white/60 text-lg font-bold pb-4">:</span>
          <div className="text-center">
            <span className="block bg-white/15 text-white text-lg font-bold px-3 py-1.5 rounded-md min-w-[3rem]">
              {time.seconds}
            </span>
            <span className="text-[10px] text-white/50 mt-1 block">SEG</span>
          </div>
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
      (e) => e.id === examId,
    );
    if (!exam) return { answered: 0, total: 0 };

    const answered = exam.preguntas.filter(
      (q) => responses[q.id] && responses[q.id].length > 0,
    ).length;
    return { answered, total: exam.preguntas.length };
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
    } catch {
      alert("Error al enviar la evaluación. Por favor, inténtalo de nuevo.");
    }
  };

  // Loading state
  if (loading || postulanteLoading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--border-color-light)] border-t-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] text-sm">
            Cargando evaluación...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)]">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--danger-light)] mb-4">
              <svg
                aria-hidden="true"
                className="h-6 w-6 text-[var(--danger)]"
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
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Error
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!initialResponses) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)] text-sm">
          No se encontró la evaluación.
        </p>
      </div>
    );
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)]">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--success-light)] mb-4">
              <svg
                aria-hidden="true"
                className="h-6 w-6 text-[var(--success)]"
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
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              ¡Evaluación Enviada!
            </h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Tu evaluación ha sido enviada correctamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentExam = selectedExamId
    ? initialResponses.evaluacion.examenes.find((e) => e.id === selectedExamId)
    : initialResponses.evaluacion.examenes[0];

  const progressPercent =
    getTotalQuestions() > 0
      ? Math.round((getTotalAnswered() / getTotalQuestions()) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-r border-[var(--border-color-light)] fixed left-0 top-0 h-full z-10">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-color-light)] bg-[var(--sidebar-bg)] text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white"
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
              <h2 className="text-base font-semibold leading-tight">
                {initialResponses.evaluacion.nombre}
              </h2>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
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
                <span>{postulante?.nombre}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
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
                <span>{postulante?.documento}</span>
              </div>
              <div className="pt-2">
                <FancyClockSVG />
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 border-b border-[var(--border-color-light)]">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">
                  Total de preguntas:
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {getTotalQuestions()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">
                  Respondidas:
                </span>
                <span className="font-medium text-[var(--success)]">
                  {getTotalAnswered()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Pendientes:</span>
                <span className="font-medium text-[var(--warning)]">
                  {getTotalQuestions() - getTotalAnswered()}
                </span>
              </div>
              <div className="w-full bg-[var(--border-color)] rounded-full h-2 mt-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-center text-xs text-[var(--text-tertiary)] mt-1">
                {progressPercent}% completado
              </div>
            </div>
          </div>

          {/* Exam List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-[var(--text-primary)] mb-3 text-sm">
                Exámenes
              </h3>
              <div className="space-y-2">
                {initialResponses.evaluacion.examenes.map((exam, index) => {
                  const progress = getExamProgress(exam.id);
                  const isSelected =
                    selectedExamId === exam.id ||
                    (selectedExamId === null && index === 0);
                  const progressPct =
                    progress.total > 0
                      ? (progress.answered / progress.total) * 100
                      : 0;

                  return (
                    <button
                      type="button"
                      key={`exam-${exam.id}-${index}`}
                      className={`w-full text-left border rounded-lg p-3 transition-all duration-200 ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary-light)]"
                          : "border-[var(--border-color-light)] hover:border-[var(--border-color)] bg-white hover:bg-[var(--table-header-bg)]"
                      }`}
                      onClick={() => setSelectedExamId(exam.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-[var(--text-primary)] leading-tight">
                          {exam.titulo}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            progress.answered === progress.total
                              ? "bg-[var(--success-light)] text-[var(--success-text)]"
                              : progress.answered > 0
                                ? "bg-[var(--warning-light)] text-[var(--warning-text)]"
                                : "bg-[var(--neutral-100)] text-[var(--text-tertiary)]"
                          }`}
                        >
                          {progress.answered}/{progress.total}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--border-color)] rounded-full h-1.5">
                        <div
                          className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 border-t border-[var(--border-color-light)] bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-md text-white font-medium text-sm transition-colors ${
                submitting
                  ? "bg-[var(--neutral-400)] cursor-not-allowed"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                  Enviando...
                </div>
              ) : (
                "Finalizar Evaluación"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                  (e) => e.id === currentExam.id,
                ) + 1
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
