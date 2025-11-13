"use client";

import { useState, useEffect } from "react";

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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const usePostulante = (
  postulanteId: string | null,
): UsePostulanteReturn => {
  const [postulante, setPostulante] = useState<PostulanteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostulante = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!postulanteId) {
        throw new Error("No se encontró ID válido en el token");
      }

      const response = await fetch(
        `${BASE_URL}/postulante?id=${postulanteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
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
  };

  useEffect(() => {
    void fetchPostulante();
  }, [postulanteId]);

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
