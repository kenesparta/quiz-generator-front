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
                    ? "border-(--primary) bg-(--primary-light)"
                    : "border-(--border-color) hover:bg-(--table-header-bg) hover:border-(--primary)"
                } ${disabled ? "cursor-default" : ""}`}
              >
                <input
                  disabled={disabled}
                  type="radio"
                  name={question.id}
                  value={key}
                  checked={isSelected}
                  onChange={(e) => handleSingleChoice(e.target.value)}
                  className="mt-0.5 h-4 w-4 text-(--primary) border-(--border-color) focus:ring-(--primary) focus:ring-1"
                />
                <div className="flex-1">
                  <span className="text-base text-(--text-primary)">
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

  const isAnswered = response.length > 0 && response[0] !== "";

  return (
    <div
      className={`rounded-lg border p-6 mb-4 transition-shadow ${
        isAnswered
          ? "bg-white border-(--border-color) border-l-4 border-l-(--primary) shadow-none"
          : "bg-white border-(--border-color-light) shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-md"
      }`}
    >
      {/* Question header */}
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 bg-(--sidebar-bg) text-white w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center">
          {questionNumber}
        </span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="text-(--text-primary) font-medium leading-relaxed text-base prose prose-base max-w-none">
              <Markdown>{question.contenido}</Markdown>
            </div>
            {isAnswered && !disabled && (
              <span className="flex-shrink-0 text-xs font-medium text-(--primary) bg-white/80 border border-(--primary) px-2 py-0.5 rounded-md">
                Respondida
              </span>
            )}
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
            className="w-full px-3 py-2.5 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors disabled:bg-(--table-header-bg) disabled:text-(--text-secondary)"
          />
        </div>
      ) : (
        renderAlternatives()
      )}

      {/* Footer */}
      {disabled && (
        <div className="mt-4 flex justify-end">
          <span className="bg-(--primary) text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
            {question.puntos} pts
          </span>
        </div>
      )}
    </div>
  );
};
