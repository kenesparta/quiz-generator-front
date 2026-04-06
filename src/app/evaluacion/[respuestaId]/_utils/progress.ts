import type { EvaluationResponse } from "@/types/evaluacion";

export function getTotalQuestions(
  initialResponses: EvaluationResponse | null,
): number {
  return (
    initialResponses?.evaluacion.examenes.reduce(
      (total, exam) => total + exam.preguntas.length,
      0,
    ) || 0
  );
}

export function getTotalAnswered(responses: Record<string, string[]>): number {
  return Object.values(responses).filter(
    (response) =>
      response && response.length > 0 && response.some((r) => r !== ""),
  ).length;
}

export function getExamProgress(
  examId: string,
  initialResponses: EvaluationResponse | null,
  responses: Record<string, string[]>,
): { answered: number; total: number } {
  const exam = initialResponses?.evaluacion.examenes.find(
    (e) => e.id === examId,
  );
  if (!exam) return { answered: 0, total: 0 };

  const answered = exam.preguntas.filter(
    (q) =>
      responses[q.id] &&
      responses[q.id].length > 0 &&
      responses[q.id].some((r) => r !== ""),
  ).length;
  return { answered, total: exam.preguntas.length };
}
