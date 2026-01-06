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
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <h3 className="font-medium text-gray-900 mb-3 text-sm">
        Resultado del Examen
      </h3>
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "apto"}
            onChange={() => onResultadoChange("apto")}
            className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-700">Apto</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "no_apto"}
            onChange={() => onResultadoChange("no_apto")}
            className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-700">No Apto</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="resultado"
            checked={resultado === "evaluacion_especializada"}
            onChange={() => onResultadoChange("evaluacion_especializada")}
            className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-700">
            Evaluacion Especializada
          </span>
        </label>
      </div>
    </div>
  );
};

export type { ResultadoTipo };
