"use client";

import { useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

interface EvaluacionItem {
  id: string;
  nombre_evaluacion: string;
  descripcion_evaluacion: string;
  estado: string;
  _links: {
    self: { href: string; method: string };
  };
}

interface EvaluacionesResponse {
  _links: {
    self: { href: string; method: string };
  };
  items: EvaluacionItem[];
}

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

export const useListaEvaluaciones = (
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
          `${BASE_URL}/respuestas?postulante_id=${postulanteId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );

        handleUnauthorized(response);
        if (!response.ok) {
          setError("Error al cargar las evaluaciones");
          return;
        }

        const data: EvaluacionesResponse = await response.json();
        const mapped: Evaluacion[] = data.items.map((item) => ({
          respuesta_id: item.id,
          nombre_evaluacion: item.nombre_evaluacion,
          descripcion_evaluacion: item.descripcion_evaluacion,
          estado: item.estado,
        }));
        setEvaluaciones(mapped);
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
        `${BASE_URL}/respuestas/${respuestaId}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ accion: "empezar" }),
        },
      );

      handleUnauthorized(response);
      if (!response.ok) {
        setError("Error al iniciar la evaluación");
        return false;
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
