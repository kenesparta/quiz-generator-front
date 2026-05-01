"use client";

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";

export interface AsignacionLink {
  href: string;
  method: string;
}

export interface AsignacionListItem {
  id: string;
  estado: string;
  fecha_tiempo_inicio: string;
  fecha_tiempo_fin: string;
  evaluacion_id: string;
  evaluacion_nombre: string;
  evaluacion_descripcion: string;
  postulante_id: string;
  postulante_documento: string;
  postulante_nombre: string;
  postulante_primer_apellido: string;
  postulante_segundo_apellido: string;
  postulante_nombre_completo: string;
  _links: Record<string, AsignacionLink>;
}

interface AsignacionesResponse {
  _links: Record<string, AsignacionLink>;
  items: AsignacionListItem[];
}

export interface AsignacionesFilters {
  postulante_id?: string;
  evaluacion_id?: string;
}

interface UseAsignacionesReturn {
  asignaciones: AsignacionListItem[];
  isLoading: boolean;
  error: string | null;
  refetch: (filters?: AsignacionesFilters) => Promise<void>;
}

export const useAsignaciones = (): UseAsignacionesReturn => {
  const [asignaciones, setAsignaciones] = useState<AsignacionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignaciones = useCallback(
    async (filters?: AsignacionesFilters): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        if (filters?.postulante_id) {
          params.append("postulante_id", filters.postulante_id);
        }
        if (filters?.evaluacion_id) {
          params.append("evaluacion_id", filters.evaluacion_id);
        }
        const qs = params.toString();
        const url = `${BASE_URL}/respuestas/asignaciones${qs ? `?${qs}` : ""}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          handleUnauthorized(response);
          if (response.status === 403) {
            setError("No tienes permiso para ver las asignaciones");
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || "Error al obtener las asignaciones");
          return;
        }

        const data = (await response.json()) as AsignacionesResponse;
        setAsignaciones(data.items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las asignaciones",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchAsignaciones();
  }, [fetchAsignaciones]);

  return {
    asignaciones,
    isLoading,
    error,
    refetch: fetchAsignaciones,
  };
};
