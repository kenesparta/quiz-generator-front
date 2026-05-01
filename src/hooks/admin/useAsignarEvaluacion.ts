"use client";

import { useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

interface AsignarEvaluacionRequest {
  evaluacion_id: string;
  postulante_id: string;
}

interface UseAsignarEvaluacionReturn {
  asignar: (data: AsignarEvaluacionRequest) => Promise<boolean>;
  isAssigning: boolean;
  error: string | null;
  reset: () => void;
}

export const useAsignarEvaluacion = (): UseAsignarEvaluacionReturn => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asignar = async (data: AsignarEvaluacionRequest): Promise<boolean> => {
    setIsAssigning(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/evaluaciones/${data.evaluacion_id}/respuestas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ postulante_id: data.postulante_id }),
        },
      );

      if (!response.ok) {
        handleUnauthorized(response);
        if (response.status === 403) {
          setError(
            "No tienes permiso para asignar evaluaciones a postulantes.",
          );
          return false;
        }
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Error al asignar la evaluación");
        return false;
      }

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al asignar la evaluación",
      );
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  const reset = () => setError(null);

  return { asignar, isAssigning, error, reset };
};
