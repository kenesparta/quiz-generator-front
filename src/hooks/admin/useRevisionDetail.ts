"use client";

import { useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";
import type { Evaluation } from "@/types/evaluacion";

export interface RevisionDetailResponse {
  id: string;
  postulante_id: string;
  resultado: string;
  revision: "sin_iniciar" | "en_proceso" | "finalizada";
  evaluacion: Evaluation;
  _links: {
    self: { href: string; method: string };
    postulante: { href: string; method: string };
  };
}

export const useRevisionDetail = (revisionId: string) => {
  const [revisionData, setRevisionData] =
    useState<RevisionDetailResponse | null>(null);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRevision = async () => {
      setError(null);
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/revisiones/${revisionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        handleUnauthorized(response);
        if (!response.ok) {
          setError(`Error ${response.status}: ${response.statusText}`);
          return;
        }

        const data: RevisionDetailResponse = await response.json();
        setRevisionData(data);

        const initialResponses: Record<string, string[]> = {};
        for (const exam of data.evaluacion.examenes) {
          for (const question of exam.preguntas) {
            initialResponses[question.id] = question.respuestas || [];
          }
        }
        setResponses(initialResponses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la revisión",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRevision();
  }, [revisionId]);

  return {
    revisionData,
    responses,
    loading,
    error,
  };
};
