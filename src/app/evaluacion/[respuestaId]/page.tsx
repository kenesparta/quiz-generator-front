"use client";

import { use, useEffect, useState } from "react";
import { ExamSection } from "@/components/ExamSection";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { usePostulante } from "@/hooks/usePostulante";
import { useRespuestaEvaluacion } from "@/hooks/useRespuestaEvaluacion";
import { getSubFromJWT } from "@/utils/jwt";
import { FancyClockSVG } from "@/components/FancyClockSVG";

interface PageProps {
  params: Promise<{
    respuestaId: string;
  }>;
}

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
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: "default" | "danger" | "success";
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    variant: "default",
    confirmLabel: "Confirmar",
    cancelLabel: "Cancelar",
    onConfirm: () => {},
  });

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
      (response) => response && response.length > 0 && response.some((r) => r !== ""),
    ).length;
  };

  const getExamProgress = (examId: string) => {
    const exam = initialResponses?.evaluacion.examenes.find(
      (e) => e.id === examId,
    );
    if (!exam) return { answered: 0, total: 0 };

    const answered = exam.preguntas.filter(
      (q) => responses[q.id] && responses[q.id].length > 0 && responses[q.id].some((r) => r !== ""),
    ).length;
    return { answered, total: exam.preguntas.length };
  };

  const closeDialog = () =>
    setDialog((prev) => ({ ...prev, open: false }));

  const doSubmit = async () => {
    closeDialog();
    try {
      await submitEvaluation(postulanteId);
      setSubmitted(true);
    } catch {
      setDialog({
        open: true,
        title: "Error",
        message:
          "Error al enviar la evaluación. Por favor, inténtalo de nuevo.",
        variant: "danger",
        confirmLabel: "Entendido",
        cancelLabel: "",
        onConfirm: closeDialog,
      });
    }
  };

  const handleSubmit = () => {
    if (getTotalAnswered() < getTotalQuestions()) {
      setDialog({
        open: true,
        title: "Preguntas sin responder",
        message:
          "Aún tienes preguntas sin responder. ¿Estás seguro de que quieres enviar la evaluación?",
        variant: "danger",
        confirmLabel: "Enviar de todos modos",
        cancelLabel: "Cancelar",
        onConfirm: doSubmit,
      });
      return;
    }

    setDialog({
      open: true,
      title: "Finalizar evaluación",
      message: "¿Estás seguro de que quieres enviar la evaluación?",
      variant: "default",
      confirmLabel: "Enviar",
      cancelLabel: "Cancelar",
      onConfirm: doSubmit,
    });
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
                <FancyClockSVG elapsedTime={elapsedTime} />
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Progreso
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-[var(--neutral-50)] rounded-lg p-2.5 text-center border border-[var(--border-color-light)]">
                <span className="block text-xl font-extrabold text-[var(--text-primary)]">
                  {getTotalQuestions()}
                </span>
                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">
                  Total
                </span>
              </div>
              <div className="bg-[var(--primary-light)] rounded-lg p-2.5 text-center border border-[var(--primary)]">
                <span className="block text-xl font-extrabold text-[var(--primary)]">
                  {getTotalAnswered()}
                </span>
                <span className="text-[10px] font-bold text-[var(--primary-dark)] uppercase tracking-wide">
                  Respondidas
                </span>
              </div>
              <div className="bg-[var(--warning-light)] rounded-lg p-2.5 text-center border border-[var(--warning)]">
                <span className="block text-xl font-extrabold text-[var(--warning-text)]">
                  {getTotalQuestions() - getTotalAnswered()}
                </span>
                <span className="text-[10px] font-bold text-[var(--warning-text)] uppercase tracking-wide">
                  Pendientes
                </span>
              </div>
            </div>
            <div className="w-full bg-[var(--border-color)] rounded-full h-2">
              <div
                className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-center text-xs font-medium text-[var(--text-secondary)] mt-1.5">
              {progressPercent}% completado
            </div>
          </div>

          {/* Exam List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
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
                      className={`w-full text-left rounded-lg p-3 transition-all duration-200 ${
                        isSelected
                          ? "bg-[var(--sidebar-bg)] text-white border-l-4 border-l-[var(--primary)] border-y border-r border-y-transparent border-r-transparent"
                          : "bg-white border border-[var(--border-color-light)] hover:border-[var(--border-color)] hover:bg-[var(--table-header-bg)]"
                      }`}
                      onClick={() => setSelectedExamId(exam.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`font-medium text-sm leading-tight ${
                            isSelected
                              ? "text-white"
                              : "text-[var(--text-primary)]"
                          }`}
                        >
                          {exam.titulo}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? progress.answered === progress.total
                                ? "bg-white/20 text-white"
                                : "bg-white/15 text-white/80"
                              : progress.answered === progress.total
                                ? "bg-[var(--success-light)] text-[var(--success-text)]"
                                : progress.answered > 0
                                  ? "bg-[var(--warning-light)] text-[var(--warning-text)]"
                                  : "bg-[var(--neutral-100)] text-[var(--text-tertiary)]"
                          }`}
                        >
                          {progress.answered}/{progress.total}
                        </span>
                      </div>
                      <div
                        className={`w-full rounded-full h-1.5 ${
                          isSelected
                            ? "bg-white/20"
                            : "bg-[var(--border-color)]"
                        }`}
                      >
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isSelected
                              ? "bg-[var(--primary)]"
                              : "bg-[var(--primary)]"
                          }`}
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
          <div className="p-4 border-t border-[var(--border-color)] bg-white">
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

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        confirmLabel={dialog.confirmLabel}
        cancelLabel={dialog.cancelLabel}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
