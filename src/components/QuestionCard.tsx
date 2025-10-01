"use client";

import { Question } from "@/types/evaluacion";

interface QuestionCardProps {
  question: Question;
  response: string[];
  onResponseChange: (response: string[]) => void;
  questionNumber: number;
}

export const QuestionCard = ({
  question,
  response,
  onResponseChange,
  questionNumber,
}: QuestionCardProps) => {
  const handleSingleChoice = (value: string) => {
    onResponseChange([value]);
  };

  const handleMultipleChoice = (optionKey: string, checked: boolean) => {
    if (checked) {
      onResponseChange([...response, optionKey]);
      return;
    }

    onResponseChange(response.filter((r) => r !== optionKey));
  };

  const handleTextResponse = (value: string) => {
    onResponseChange([value]);
  };

  const renderAlternatives = () => {
    const alternatives = Object.entries(question.alternativas);

    if (
      question.tipo_de_pregunta === "alternativa_unica" ||
      question.tipo_de_pregunta === "alternativa_peso"
    ) {
      return (
        <div className="space-y-3 mt-4">
          {alternatives.map(([key, value]) => (
            <label
              key={key}
              className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name={question._id}
                value={key}
                checked={response[0] === key}
                onChange={(e) => handleSingleChoice(e.target.value)}
                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-gray-700">{value}</span>
              </div>
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {questionNumber}
        </span>
        <div className="flex-1">
          <div
            className="text-gray-900 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.contenido }}
          />
        </div>
      </div>

      {question.tipo_de_pregunta === "sola_respuesta" ? (
        <div className="mt-4">
          <input
            type="text"
            value={response[0] || ""}
            onChange={(e) => handleTextResponse(e.target.value)}
            placeholder="Escriba su respuesta aquí..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : (
        renderAlternatives()
      )}

      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        {response.length > 0 && (
          <span className="text-green-600 font-medium flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Respondida
          </span>
        )}
      </div>
    </div>
  );
};
