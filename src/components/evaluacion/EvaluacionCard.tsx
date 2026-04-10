"use client";

import { useRouter } from "next/navigation";
import { EstadoDot } from "./EstadoDot";

interface EvaluacionCardProps {
  respuestaId: string;
  nombreEvaluacion: string;
  descripcionEvaluacion: string;
  estado: string;
  isStarting: boolean;
  onStart: (respuestaId: string) => void;
}

export function EvaluacionCard({
  respuestaId,
  nombreEvaluacion,
  descripcionEvaluacion,
  estado,
  isStarting,
  onStart,
}: EvaluacionCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-(--primary-light) flex items-center justify-center text-(--primary) shrink-0 mt-0.5">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path d="M9 14l2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base font-semibold text-(--text-primary)">
                {nombreEvaluacion}
              </h2>
              <EstadoDot estado={estado} />
            </div>
            <p className="text-sm text-(--text-tertiary)">
              {descripcionEvaluacion}
            </p>
          </div>
        </div>
        <div className="ml-4 shrink-0">
          {estado === "completado" ? (
            <button
              type="button"
              disabled
              className="px-4 py-2 bg-(--neutral-100) text-(--text-tertiary) rounded-md cursor-not-allowed text-sm"
            >
              Completado
            </button>
          ) : estado === "en_progreso" ? (
            <button
              type="button"
              onClick={() => router.push(`/evaluacion/${respuestaId}`)}
              className="px-4 py-2 bg-white border border-(--warning) text-(--warning-text) rounded-md hover:bg-(--warning-light) transition-colors text-sm font-medium cursor-pointer"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStart(respuestaId)}
              disabled={isStarting}
              className="px-4 py-2 bg-(--primary) text-white rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isStarting ? (
                <span className="flex items-center">
                  <svg
                    aria-hidden="true"
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                "Iniciar"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
