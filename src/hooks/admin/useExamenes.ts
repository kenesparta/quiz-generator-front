"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

export interface ExamenLink {
  href: string;
  method: string;
}

export interface ExamenListItem {
  id: string;
  titulo: string;
  descripcion: string;
  instrucciones: string;
  estado: string;
  cantidad_preguntas: number;
  _links: Record<string, ExamenLink>;
}

interface ExamenesResponse {
  _links: Record<string, ExamenLink>;
  items: ExamenListItem[];
}

interface UseExamenesReturn {
  examenes: ExamenListItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useExamenes = (): UseExamenesReturn => {
  const [examenes, setExamenes] = useState<ExamenListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExamenes = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/examenes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        handleUnauthorized(response);
        if (response.status === 403) {
          setError("No tienes permiso para ver los exámenes");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Error al obtener los exámenes");
        return;
      }

      const data = (await response.json()) as ExamenesResponse;
      setExamenes(data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los exámenes",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExamenes();
  }, [fetchExamenes]);

  return {
    examenes,
    isLoading,
    error,
    refetch: fetchExamenes,
  };
};
