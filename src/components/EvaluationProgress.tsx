"use client";

interface EvaluationProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
  evaluationName: string;
  startTime: string;
}

export const EvaluationProgress = ({
  totalQuestions,
  answeredQuestions,
  evaluationName,
  startTime,
}: EvaluationProgressProps) => {
  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100,
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{evaluationName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Iniciado: {new Date(startTime).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-500">Completado</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Preguntas respondidas: {answeredQuestions}/{totalQuestions}
          </span>
          <span>{totalQuestions - answeredQuestions} restantes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
