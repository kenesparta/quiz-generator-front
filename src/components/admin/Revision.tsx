"use client";

import { ExamSection } from "@/components/ExamSection";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { useRespuestaEvaluacion } from "@/hooks/useRespuestaEvaluacion";
import { BASE_URL } from "@/config/api";
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
  } = useRespuestaEvaluacion(postulanteId, revisionId);

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [examObservaciones, setExamObservaciones] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultado, setResultado] = useState<ResultadoTipo>("apto");
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
    confirmLabel: "Entendido",
    cancelLabel: "",
    onConfirm: () => {},
  });
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleObservacionChange = (examId: string, observacion: string) => {
    setExamObservaciones((prev) => ({
      ...prev,
      [examId]: observacion,
    }));
  };

  const showError = (message: string) => {
    setDialog({
      open: true,
      title: "Error",
      message,
      variant: "danger",
      confirmLabel: "Entendido",
      cancelLabel: "",
      onConfirm: closeDialog,
    });
  };

  const doFinalize = async () => {
    closeDialog();
    if (!initialResponses) return;

    setIsSubmitting(true);
    try {
      const examenes = initialResponses.evaluacion.examenes.map((exam) => ({
        examen_id: exam.id,
        observacion: examObservaciones[exam.id] || "",
      }));

      const payload = {
        respuesta_id: initialResponses.id,
        evaluacion_id: initialResponses.evaluacion.id,
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
        setDialog({
          open: true,
          title: "Revisión finalizada",
          message: "La revisión se ha finalizado correctamente.",
          variant: "success",
          confirmLabel: "Aceptar",
          cancelLabel: "",
          onConfirm: () => {
            closeDialog();
            window.location.href = "/admin/dashboard/revision";
          },
        });
      } else if (response.status === 403) {
        showError("No tienes permisos para finalizar esta revisión.");
      } else if (response.status === 500) {
        showError(
          "Error del servidor al finalizar la revisión. Por favor, inténtalo de nuevo.",
        );
      } else {
        showError("Error inesperado. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      showError(
        "Error al enviar las observaciones. Por favor, inténtalo de nuevo.",
      );
      console.error("Error submitting revision:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = () => {
    if (!initialResponses) {
      showError("No se encontró la evaluación.");
      return;
    }

    setDialog({
      open: true,
      title: "Finalizar revisión",
      message:
        "¿Estás seguro de que quieres finalizar la revisión? Las observaciones serán enviadas.",
      variant: "default",
      confirmLabel: "Finalizar",
      cancelLabel: "Cancelar",
      onConfirm: doFinalize,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  if (!initialResponses) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">
          No se encontró la evaluación.
        </p>
      </div>
    );
  }

  const currentExam = selectedExamId
    ? initialResponses.evaluacion.examenes.find((e) => e.id === selectedExamId)
    : initialResponses.evaluacion.examenes[0];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex">
      {/* Sticky Left Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-[var(--border-color)] fixed left-0 top-0 h-full z-10">
        <div className="flex flex-col h-full">
          {/* Return Button */}
          <div className="p-4 border-b border-[var(--border-color)]">
            <a
              href="/admin/dashboard/revision"
              className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
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
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--primary-light)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Revisión
            </h2>
            <div className="text-sm text-[var(--text-secondary)]">
              {initialResponses.evaluacion.nombre}
            </div>
          </div>

          {/* Exams List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-3 text-sm">
              Exámenes
            </h3>
            <div className="space-y-2">
              {initialResponses.evaluacion.examenes.map((exam, index) => {
                const isSelected =
                  selectedExamId === exam.id ||
                  (selectedExamId === null && index === 0);

                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-[var(--success)] bg-[var(--success-light)] text-[var(--success-text)]"
                        : "border-[var(--border-color)] bg-white hover:border-[var(--border-color)] hover:bg-[var(--page-bg)]"
                    }`}
                  >
                    <div className="font-medium text-sm">
                      Examen {index + 1}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 truncate">
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
          <div className="p-4 border-t border-[var(--border-color)] bg-white">
            <button
              onClick={handleFinalize}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-[var(--neutral-400)] cursor-not-allowed"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] hover:shadow-xl"
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
                  (e) => e.id === currentExam.id,
                ) + 1
              }
              disabled
              comment={examObservaciones[currentExam.id] || ""}
              onCommentChange={(observacion) =>
                handleObservacionChange(currentExam.id, observacion)
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
};
