"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";
import type {
  CreatePostulanteRequest,
  PostulanteListItem,
} from "@/types/postulante";

interface UsePostulanteReturn {
  postulantes: PostulanteListItem[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isSearching: boolean;
  isUpdating: boolean;
  createPostulante: (data: CreatePostulanteRequest) => Promise<boolean>;
  updatePostulante: (data: CreatePostulanteRequest) => Promise<boolean>;
  searchByDocumento: (
    documento: string,
  ) => Promise<CreatePostulanteRequest | null>;
  refetch: () => Promise<void>;
}

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
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPostulantes = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/postulantes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al obtener los postulantes");
        return;
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
  }, []);

  const createPostulante = async (
    data: CreatePostulanteRequest,
  ): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const uuid = generateUUID();
      const response = await fetch(`${BASE_URL}/postulantes/${uuid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al crear el postulante");
        return false;
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

  const searchByDocumento = async (
    documento: string,
  ): Promise<CreatePostulanteRequest | null> => {
    setIsSearching(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/postulantes?documento=${documento}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al buscar el postulante");
        return null;
      }

      const data = (await response.json()) as PostulanteListItem;
      return {
        documento: data.documento,
        nombre: data.nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        fecha_nacimiento: data.fecha_nacimiento,
        grado_instruccion:
          data.grado_instruccion.toLowerCase() as CreatePostulanteRequest["grado_instruccion"],
        genero: data.genero.toLowerCase() as CreatePostulanteRequest["genero"],
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al buscar el postulante",
      );
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const updatePostulante = async (
    data: CreatePostulanteRequest,
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/postulantes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al actualizar el postulante");
        return false;
      }

      await fetchPostulantes();
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el postulante",
      );
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    void fetchPostulantes();
  }, [fetchPostulantes]);

  return {
    postulantes,
    isLoading,
    error,
    isCreating,
    isSearching,
    isUpdating,
    createPostulante,
    updatePostulante,
    searchByDocumento,
    refetch: fetchPostulantes,
  };
};
