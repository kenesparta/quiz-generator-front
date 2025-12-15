"use client";

import { useEffect, useState } from "react";

interface Evaluacion {
  respuesta_id: string;
  nombre_evaluacion: string;
  descripcion_evaluacion: string;
  estado: string;
}

interface UseEvaluacionesReturn {
  evaluaciones: Evaluacion[];
  isLoading: boolean;
  error: string | null;
  startEvaluacion: (respuestaId: string) => Promise<boolean>;
  isStarting: boolean;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const useEvaluaciones = (
  postulanteId: string | null,
): UseEvaluacionesReturn => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!postulanteId) return;

    const fetchEvaluaciones = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/respuesta/postulante/${postulanteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );

        if (!response.ok) {
          throw new Error("Error al cargar las evaluaciones");
        }

        const data: Evaluacion[] = await response.json();
        setEvaluaciones(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar evaluaciones",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluaciones();
  }, [postulanteId]);

  const startEvaluacion = async (respuestaId: string): Promise<boolean> => {
    setIsStarting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/respuesta/${respuestaId}/empezar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error("Error al iniciar la evaluación");
      }

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar la evaluación",
      );
      return false;
    } finally {
      setIsStarting(false);
    }
  };

  return {
    evaluaciones,
    isLoading,
    error,
    startEvaluacion,
    isStarting,
  };
};
