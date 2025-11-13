"use client";

import { ExamSection } from "@/components/ExamSection";
import { useState } from "react";
import { useEvaluation } from "@/hooks/useEvaluation";

interface RevisionProps {
  postulanteId: string;
}

export const Revision = ({ postulanteId }: RevisionProps) => {
  const {
    initialResponses,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  } = useEvaluation(postulanteId);

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

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
      <div> small sticky left nav</div>
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
            />
          )}
        </div>
      </div>
    </div>
  );
};
