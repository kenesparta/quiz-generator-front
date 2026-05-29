"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";
import type {
  CreatePsicologoRequest,
  PsicologoListItem,
} from "@/types/psicologo";

interface PsicologoListResponseItem {
  id: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  documento: string;
  especialidad: string;
  colegiatura: string;
  _links: { self: { href: string; method: string } };
}

interface PsicologoListResponse {
  _links: { self: { href: string; method: string } };
  items: PsicologoListResponseItem[];
}

interface UsePsicologoReturn {
  psicologos: PsicologoListItem[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  clearError: () => void;
  createPsicologo: (data: CreatePsicologoRequest) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const usePsicologo = (): UsePsicologoReturn => {
  const [psicologos, setPsicologos] = useState<PsicologoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPsicologos = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/psicologos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      handleUnauthorized(response);
      if (!response.ok) {
        setError("Error al obtener los psicólogos");
        return;
      }

      const data: PsicologoListResponse = await response.json();
      const mapped: PsicologoListItem[] = data.items.map((item) => ({
        id: item.id,
        documento: item.documento,
        nombre: item.nombre,
        primer_apellido: item.primer_apellido,
        segundo_apellido: item.segundo_apellido,
        especialidad: item.especialidad,
        colegiatura: item.colegiatura,
      }));
      setPsicologos(mapped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los psicólogos",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPsicologo = async (
    data: CreatePsicologoRequest,
  ): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const uuid = generateUUID();
      const response = await fetch(`${BASE_URL}/psicologos/${uuid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let message = "Error al crear el psicólogo";
        try {
          const parsed = JSON.parse(errorBody);
          message =
            typeof parsed === "string" ? parsed : parsed.message || message;
        } catch {
          if (errorBody) message = errorBody;
        }
        setError(message);
        return false;
      }

      await fetchPsicologos();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el psicólogo",
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    void fetchPsicologos();
  }, [fetchPsicologos]);

  return {
    psicologos,
    isLoading,
    isCreating,
    error,
    clearError: () => setError(null),
    createPsicologo,
    refetch: fetchPsicologos,
  };
};
