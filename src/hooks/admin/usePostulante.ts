"use client";

import { useState, useEffect } from "react";
import type {
  PostulanteListItem,
  CreatePostulanteRequest,
} from "@/types/postulante";

interface UsePostulanteReturn {
  postulantes: PostulanteListItem[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createPostulante: (data: CreatePostulanteRequest) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

// Generate UUID v4
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const usePostulante = (): UsePostulanteReturn => {
  const [postulantes, setPostulantes] = useState<PostulanteListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPostulantes = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/postulante`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al obtener los postulantes",
        );
      }

      const data: PostulanteListItem[] = await response.json();
      setPostulantes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los postulantes",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createPostulante = async (
    data: CreatePostulanteRequest,
  ): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      const uuid = generateUUID();
      const response = await fetch(`${BASE_URL}/postulante/${uuid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear el postulante");
      }

      // Create respuesta for the new postulante
      const respuestaResponse = await fetch(`${BASE_URL}/respuesta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evaluacion_id: "2cf52b7a-0ee3-43a9-9b89-4a8baaa22250",
          postulante_id: uuid,
        }),
      });

      if (!respuestaResponse.ok) {
        const errorData = await respuestaResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al crear la respuesta del postulante",
        );
      }

      // Refresh the list after creating
      await fetchPostulantes();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el postulante",
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchPostulantes();
  }, []);

  return {
    postulantes,
    isLoading,
    error,
    isCreating,
    createPostulante,
    refetch: fetchPostulantes,
  };
};
