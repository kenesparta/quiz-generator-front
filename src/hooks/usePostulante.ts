"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

interface PostulanteData {
  documento: string;
  nombre: string;
}

interface UsePostulanteReturn {
  postulante: PostulanteData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePostulante = (
  postulanteId: string | null,
): UsePostulanteReturn => {
  const [postulante, setPostulante] = useState<PostulanteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostulante = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!postulanteId) {
        setError("No se encontró ID válido en el token");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/postulantes?id=${postulanteId}`,
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
        setError(`Error ${response.status}: ${response.statusText}`);
        return;
      }

      const data: PostulanteData = await response.json();
      setPostulante(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener información del postulante",
      );
    } finally {
      setIsLoading(false);
    }
  }, [postulanteId]);

  useEffect(() => {
    void fetchPostulante();
  }, [fetchPostulante]);

  const refetch = async (): Promise<void> => {
    await fetchPostulante();
  };

  return {
    postulante,
    isLoading,
    error,
    refetch,
  };
};
