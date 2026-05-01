"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

export interface EvaluacionLink {
  href: string;
  method: string;
}

export interface EvaluacionListItem {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  esta_activo: string;
  cantidad_examenes: number;
  _links: Record<string, EvaluacionLink>;
}

interface EvaluacionesResponse {
  _links: Record<string, EvaluacionLink>;
  items: EvaluacionListItem[];
}

interface UseEvaluacionesReturn {
  evaluaciones: EvaluacionListItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEvaluaciones = (): UseEvaluacionesReturn => {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluaciones = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/evaluaciones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        handleUnauthorized(response);
        if (response.status === 403) {
          setError("No tienes permiso para ver las evaluaciones");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Error al obtener las evaluaciones");
        return;
      }

      const data = (await response.json()) as EvaluacionesResponse;
      setEvaluaciones(data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las evaluaciones",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvaluaciones();
  }, [fetchEvaluaciones]);

  return {
    evaluaciones,
    isLoading,
    error,
    refetch: fetchEvaluaciones,
  };
};
