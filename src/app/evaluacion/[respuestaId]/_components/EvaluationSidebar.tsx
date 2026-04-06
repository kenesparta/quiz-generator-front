"use client";

import { FancyClockSVG } from "@/components/FancyClockSVG";
import type { EvaluationResponse } from "@/types/evaluacion";
import {
  getExamProgress,
  getTotalAnswered,
  getTotalQuestions,
} from "../_utils/progress";

interface EvaluationSidebarProps {
  initialResponses: EvaluationResponse;
  postulante: { nombre: string; documento: string } | null;
  responses: Record<string, string[]>;
  elapsedTime: number;
  selectedExamId: string | null;
  submitting: boolean;
  onSelectExam: (examId: string) => void;
  onSubmit: () => void;
}

export function EvaluationSidebar({
  initialResponses,
  postulante,
  responses,
  elapsedTime,
  selectedExamId,
  submitting,
  onSelectExam,
  onSubmit,
}: EvaluationSidebarProps) {
  const totalQuestions = getTotalQuestions(initialResponses);
  const totalAnswered = getTotalAnswered(responses);
  const progressPercent =
    totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <div className="w-80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-r border-(--border-color-light) fixed left-0 top-0 h-full z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-(--border-color-light) bg-(--sidebar-bg) text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
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
        <div className="p-4 border-b border-(--border-color)">
          <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-wider mb-3">
            Progreso
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-(--neutral-50) rounded-lg p-2.5 text-center border border-(--border-color-light)">
              <span className="block text-xl font-extrabold text-(--text-primary)">
                {totalQuestions}
              </span>
              <span className="text-[10px] font-bold text-(--text-tertiary) uppercase tracking-wide">
                Total
              </span>
            </div>
            <div className="bg-(--primary-light) rounded-lg p-2.5 text-center border border-(--primary)">
              <span className="block text-xl font-extrabold text-(--primary)">
                {totalAnswered}
              </span>
              <span className="text-[10px] font-bold text-(--primary-dark) uppercase tracking-wide">
                Respondidas
              </span>
            </div>
            <div className="bg-(--warning-light) rounded-lg p-2.5 text-center border border-(--warning)">
              <span className="block text-xl font-extrabold text-(--warning-text)">
                {totalQuestions - totalAnswered}
              </span>
              <span className="text-[10px] font-bold text-(--warning-text) uppercase tracking-wide">
                Pendientes
              </span>
            </div>
          </div>
          <div className="w-full bg-(--border-color) rounded-full h-2">
            <div
              className="bg-(--primary) h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-center text-xs font-medium text-(--text-secondary) mt-1.5">
            {progressPercent}% completado
          </div>
          {progressPercent === 100 ? (
            <div className="mt-3 flex items-center justify-center gap-2 bg-(--success-light) text-(--success-text) rounded-lg px-3 py-2 border border-(--success)">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wide">
                Evaluación Completada
              </span>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-2 bg-(--warning-light) text-(--warning-text) rounded-lg px-3 py-2 border border-(--warning)">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wide">
                En Progreso
              </span>
            </div>
          )}
        </div>

        {/* Exam List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-wider mb-3">
              Exámenes
            </h3>
            <div className="space-y-2">
              {initialResponses.evaluacion.examenes.map((exam, index) => {
                const progress = getExamProgress(
                  exam.id,
                  initialResponses,
                  responses,
                );
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
                        ? "bg-(--sidebar-bg) text-white border-l-4 border-l-(--primary) border-y border-r border-y-transparent border-r-transparent"
                        : "bg-white border border-(--border-color-light) hover:border-(--border-color) hover:bg-(--table-header-bg)"
                    }`}
                    onClick={() => onSelectExam(exam.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4
                        className={`font-medium text-sm leading-tight ${
                          isSelected
                            ? "text-white"
                            : "text-(--text-primary)"
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
                              ? "bg-(--success-light) text-(--success-text)"
                              : progress.answered > 0
                                ? "bg-(--warning-light) text-(--warning-text)"
                                : "bg-(--neutral-100) text-(--text-tertiary)"
                        }`}
                      >
                        {progress.answered}/{progress.total}
                      </span>
                    </div>
                    <div
                      className={`w-full rounded-full h-1.5 ${
                        isSelected ? "bg-white/20" : "bg-(--border-color)"
                      }`}
                    >
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-(--primary)"
                            : "bg-(--primary)"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    {progressPct === 100 ? (
                      <div
                        className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${
                          isSelected
                            ? "text-(--success)"
                            : "text-(--success-text)"
                        }`}
                      >
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Finalizado
                      </div>
                    ) : (
                      <div
                        className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${
                          isSelected
                            ? "text-white/60"
                            : "text-(--warning-text)"
                        }`}
                      >
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
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        En Progreso
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t border-(--border-color) bg-white">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={`w-full py-4 rounded-md text-white font-semibold text-lg transition-colors ${
              submitting
                ? "bg-(--neutral-400) cursor-not-allowed"
                : "bg-(--primary) hover:bg-(--primary-dark)"
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Finalizar
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
