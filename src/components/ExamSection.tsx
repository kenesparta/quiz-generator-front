"use client";

import type { Exam } from "@/types/evaluacion";
import { QuestionCard } from "./QuestionCard";

interface ExamSectionProps {
  exam: Exam;
  responses: Record<string, string[]>;
  onResponseChange: (
    postulanteId: string | null,
    questionId: string,
    response: string[],
  ) => void;
  examNumber: number;
  postulanteId: string | null;
  disabled?: boolean;
  comment?: string;
  onCommentChange?: (comment: string) => void;
}

export const ExamSection = ({
  exam,
  responses,
  onResponseChange,
  examNumber,
  postulanteId,
  disabled = false,
  comment = "",
  onCommentChange,
}: ExamSectionProps) => {
  const answeredQuestions = exam.preguntas.filter(
    (q) =>
      responses[q.id] &&
      responses[q.id].length > 0 &&
      responses[q.id].some((r) => r !== ""),
  ).length;

  const totalQuestions = exam.preguntas.length;

  return (
    <div className="mb-12">
      {/* Exam Header */}
      <div className="bg-(--sidebar-bg) text-white rounded-t-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">
            {examNumber}. {exam.titulo}
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-(--primary) text-white px-3 py-1 rounded-full text-sm font-semibold">
              {answeredQuestions}/{totalQuestions}
            </span>
            {disabled && (
              <span className="bg-white text-(--sidebar-bg) px-4 py-1.5 rounded-full text-sm font-bold">
                {exam.puntos_obtenidos} pts
              </span>
            )}
          </div>
        </div>

        <p className="text-white/60 mb-4">{exam.descripcion}</p>

        {!disabled && exam.instrucciones && (
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center text-sm font-medium mb-1">
              <svg
                aria-hidden="true"
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Instrucciones:
            </div>
            <p className="text-sm text-white/70">{exam.instrucciones}</p>
          </div>
        )}

        {disabled && (
          <div className="bg-white/10 rounded-lg p-3">
            <label
              htmlFor={`comments-${exam.id}`}
              className="flex items-center text-sm font-medium mb-2"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l.92-3.917A6.995 6.995 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Observaciones:
            </label>
            <textarea
              id={`comments-${exam.id}`}
              rows={4}
              value={comment}
              onChange={(e) => onCommentChange?.(e.target.value)}
              className="bg-white w-full px-3 py-2 text-(--text-primary) border border-(--border-color) rounded-md focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none resize-none text-sm"
              placeholder="Escribe tus observaciones aquí..."
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <div>
        {exam.preguntas.map((question, index) => (
          <QuestionCard
            key={question.id ?? index}
            question={question}
            response={responses[question.id] || []}
            onResponseChange={(response) =>
              onResponseChange(postulanteId, question.id, response)
            }
            questionNumber={index + 1}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
