"use client";

type ResultadoTipo = "apto" | "no_apto" | "evaluacion_especializada";

interface ResultadoDelExamenProps {
  resultado: ResultadoTipo;
  onResultadoChange: (value: ResultadoTipo) => void;
}

export const ResultadoDelExamen = ({
  resultado,
  onResultadoChange,
}: ResultadoDelExamenProps) => {
  return (
    <div className="p-4 border-t border-(--border-color) bg-(--neutral-50)">
      <h3 className="font-medium text-(--text-primary) mb-3 text-sm">
        Resultado del Examen
      </h3>
      <div className="space-y-2">
        {(
          [
            { value: "apto", label: "Apto" },
            { value: "no_apto", label: "No Apto" },
            {
              value: "evaluacion_especializada",
              label: "Evaluación Especializada",
            },
          ] as const
        ).map(({ value, label }) => {
          const isSelected = resultado === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onResultadoChange(value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-(--primary) bg-(--primary-light) text-(--primary) font-medium"
                  : "border-(--border-color) bg-white text-(--text-primary) hover:border-(--border-color) hover:bg-(--page-bg)"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  isSelected
                    ? "border-(--primary)"
                    : "border-(--neutral-300)"
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-(--primary)" />
                )}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type { ResultadoTipo };
