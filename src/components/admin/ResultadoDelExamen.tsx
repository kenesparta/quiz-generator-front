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
    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--neutral-50)]">
      <h3 className="font-medium text-[var(--text-primary)] mb-3 text-sm">
        Resultado del Examen
      </h3>
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "apto"}
            onChange={() => onResultadoChange("apto")}
            className="w-4 h-4 text-[var(--primary)] bg-[var(--neutral-100)] focus:ring-[var(--primary)] focus:ring-2"
          />
          <span className="ml-2 text-sm text-[var(--text-primary)]">Apto</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "no_apto"}
            onChange={() => onResultadoChange("no_apto")}
            className="w-4 h-4 text-[var(--primary)] bg-[var(--neutral-100)] focus:ring-[var(--primary)] focus:ring-2"
          />
          <span className="ml-2 text-sm text-[var(--text-primary)]">
            No Apto
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "evaluacion_especializada"}
            onChange={() => onResultadoChange("evaluacion_especializada")}
            className="w-4 h-4 text-[var(--primary)] bg-[var(--neutral-100)] focus:ring-[var(--primary)] focus:ring-2"
          />
          <span className="ml-2 text-sm text-[var(--text-primary)]">
            Evaluacion Especializada
          </span>
        </label>
      </div>
    </div>
  );
};

export type { ResultadoTipo };
