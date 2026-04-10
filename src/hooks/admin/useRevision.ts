"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";

interface PostulanteData {
  documento: string;
  nombre: string;
}

interface RevisionItemResponse {
  respuesta_id: string;
  nombre_evaluacion: string;
  descripcion_evaluacion: string;
  estado_revision: "sin_iniciar" | "en_proceso" | "finalizada";
  postulante_id: string;
  _links: {
    revisar: { href: string; method: string };
    postulante: { href: string; method: string };
    self: { href: string; method: string };
    respuesta: { href: string; method: string };
  };
}

interface RevisionesResponse {
  _links: {
    self: { href: string; method: string };
  };
  items: RevisionItemResponse[];
}

export interface RevisionItem {
  respuesta_id: string;
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

export const useRevision = (): UseRevisionReturn => {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostulante = useCallback(
    async (href: string): Promise<PostulanteData | null> => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}${href}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          return null;
        }

        return (await response.json()) as PostulanteData;
      } catch {
        return null;
      }
    },
    [],
  );

  const fetchRevisions = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/revisiones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al obtener las revisiones");
        return;
      }

      const data: RevisionesResponse = await response.json();

      const revisionsWithPostulantes = await Promise.all(
        data.items.map(async (item) => {
          const postulante = await fetchPostulante(item._links.postulante.href);
          return {
            respuesta_id: item.respuesta_id,
            nombre_evaluacion: item.nombre_evaluacion,
            descripcion_evaluacion: item.descripcion_evaluacion,
            estado_revision: item.estado_revision,
            postulante_id: item.postulante_id,
            postulante: postulante || undefined,
          };
        }),
      );

      setRevisions(revisionsWithPostulantes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las revisiones",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchPostulante]);

  useEffect(() => {
    void fetchRevisions();
  }, [fetchRevisions]);

  return {
    revisions,
    isLoading,
    error,
    refetch: fetchRevisions,
  };
};
