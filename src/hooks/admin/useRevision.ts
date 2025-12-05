"use client";

import { useState, useEffect } from "react";

interface PostulanteData {
  documento: string;
  nombre: string;
}

interface RevisionItem {
  nombre_evaluacion: string;
  descripcion_evaluacion: string;
  estado_revision: "sin_iniciar" | "en_proceso" | "finalizada";
  postulante_id: string;
  postulante?: PostulanteData;
}

interface UseRevisionReturn {
  revisions: RevisionItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const useRevision = (): UseRevisionReturn => {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostulante = async (
    postulanteId: string,
  ): Promise<PostulanteData | null> => {
    try {
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
        return null;
      }

      const data: PostulanteData = await response.json();
      return data;
    } catch {
      return null;
    }
  };

  const fetchRevisions = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/respuesta/revision`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener las revisiones");
      }

      const data: RevisionItem[] = await response.json();

      // Fetch postulante details for each revision
      const revisionsWithPostulantes = await Promise.all(
        data.map(async (revision) => {
          const postulante = await fetchPostulante(revision.postulante_id);
          return {
            ...revision,
            postulante: postulante || undefined,
          };
        }),
      );

      setRevisions(revisionsWithPostulantes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las revisiones"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  return {
    revisions,
    isLoading,
    error,
    refetch: fetchRevisions,
  };
};
