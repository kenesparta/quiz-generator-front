"use client";

import { use, useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExamSection } from "@/components/ExamSection";
import { usePostulante } from "@/hooks/usePostulante";
import { useRespuestaEvaluacion } from "@/hooks/useRespuestaEvaluacion";
import { getSubFromJWT } from "@/utils/jwt";
import { EvaluationSidebar } from "./_components/EvaluationSidebar";
import {
  ErrorScreen,
  LoadingScreen,
  NoDataScreen,
  SubmittedScreen,
} from "./_components/EvaluationStateScreens";
import { useConfirmDialog } from "./_hooks/useConfirmDialog";
import { getTotalAnswered, getTotalQuestions } from "./_utils/progress";

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
  const { dialog, openDialog, closeDialog } = useConfirmDialog();

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

  const doSubmit = async () => {
    closeDialog();
    try {
      await submitEvaluation(postulanteId);
      setSubmitted(true);
    } catch {
      openDialog({
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
    if (getTotalAnswered(responses) < getTotalQuestions(initialResponses)) {
      openDialog({
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

    openDialog({
      title: "Finalizar evaluación",
      message: "¿Estás seguro de que quieres enviar la evaluación?",
      variant: "default",
      confirmLabel: "Enviar",
      cancelLabel: "Cancelar",
      onConfirm: doSubmit,
    });
  };

  if (loading || postulanteLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!initialResponses) return <NoDataScreen />;
  if (submitted) return <SubmittedScreen />;

  const currentExam = selectedExamId
    ? initialResponses.evaluacion.examenes.find((e) => e.id === selectedExamId)
    : initialResponses.evaluacion.examenes[0];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex">
      <EvaluationSidebar
        initialResponses={initialResponses}
        postulante={postulante}
        responses={responses}
        elapsedTime={elapsedTime}
        selectedExamId={selectedExamId}
        submitting={submitting}
        onSelectExam={setSelectedExamId}
        onSubmit={handleSubmit}
      />

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
