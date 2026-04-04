"use client";

import Markdown from "react-markdown";
import type { Question } from "@/types/evaluacion";

interface QuestionCardProps {
  question: Question;
  response: string[];
  onResponseChange: (response: string[]) => void;
  questionNumber: number;
  disabled: boolean;
}

export const QuestionCard = ({
  question,
  response,
  onResponseChange,
  questionNumber,
  disabled = false,
}: QuestionCardProps) => {
  const handleSingleChoice = (value: string) => {
    onResponseChange([value]);
  };

  const handleTextResponse = (value: string) => {
    onResponseChange([value]);
  };

  const renderAlternatives = () => {
    const alternatives = Object.entries(question.alternativas).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    if (
      question.tipo_de_pregunta === "alternativa_unica" ||
      question.tipo_de_pregunta === "alternativa_peso"
    ) {
      return (
        <div className="space-y-2 mt-4">
          {alternatives.map(([key, value]) => {
            const isSelected = response[0] === key;
            return (
              <label
                key={key}
                className={`flex items-start space-x-3 cursor-pointer p-3 rounded-md border transition-colors ${
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border-color)] hover:bg-[var(--table-header-bg)] hover:border-[var(--primary)]"
                } ${disabled ? "cursor-default" : ""}`}
              >
                <input
                  disabled={disabled}
                  type="radio"
                  name={question.id}
                  value={key}
                  checked={isSelected}
                  onChange={(e) => handleSingleChoice(e.target.value)}
                  className="mt-0.5 h-4 w-4 text-[var(--primary)] border-[var(--border-color)] focus:ring-[var(--primary)] focus:ring-1"
                />
                <div className="flex-1">
                  <span className="text-base text-[var(--text-primary)]">
                    {value}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color-light)] p-6 mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
      {/* Question header */}
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 bg-[var(--sidebar-bg)] text-white w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center">
          {questionNumber}
        </span>
        <div className="flex-1">
          <div className="text-[var(--text-primary)] font-medium leading-relaxed text-base prose prose-base max-w-none">
            <Markdown>{question.contenido}</Markdown>
          </div>
        </div>
      </div>

      {/* Answer input */}
      {question.tipo_de_pregunta === "sola_respuesta" ? (
        <div className="mt-4">
          <input
            disabled={disabled}
            type="text"
            value={response[0] || ""}
            onChange={(e) => handleTextResponse(e.target.value)}
            placeholder="Escriba su respuesta aquí..."
            className="w-full px-3 py-2.5 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors disabled:bg-[var(--table-header-bg)] disabled:text-[var(--text-secondary)]"
          />
        </div>
      ) : (
        renderAlternatives()
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        {response.length > 0 && (
          <span className="text-[var(--success)] text-xs font-medium flex items-center gap-1">
            <svg
              aria-hidden="true"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Respondida
          </span>
        )}
        {disabled && (
          <span className="bg-[var(--table-header-bg)] text-[var(--primary)] px-3 py-1 rounded-full text-xs font-semibold">
            Puntaje: {question.puntos}
          </span>
        )}
      </div>
    </div>
  );
};
