"use client";

import { useEffect, useState } from "react";
import { BASE_URL, handleUnauthorized } from "@/config/api";
import type { EvaluationResponse } from "@/types/evaluacion";

export const useRespuestaEvaluacion = (
  postulanteId: string | null,
  revisionId: string | null,
) => {
  const [initialResponses, setInitialResponses] =
    useState<EvaluationResponse | null>(null);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        if (!postulanteId) {
          setError(
            "No se encontró ID de postulante. Por favor, inicie sesión.",
          );
          setLoading(false);
          return;
        }

        setError(null);
        setLoading(true);

        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/respuestas/${revisionId}`, {
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

        const data: EvaluationResponse = await response.json();
        setInitialResponses(data);

        // Initialize responses with existing answers
        const initialResponses: Record<string, string[]> = {};
        data.evaluacion.examenes.forEach((exam) => {
          exam.preguntas.forEach((question) => {
            initialResponses[question.id] = question.respuestas || [];
          });
        });
        setResponses(initialResponses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la evaluación",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadEvaluation();
  }, [postulanteId, revisionId]);

  const updateResponse = async (
    _postulanteId: string | null,
    questionId: string,
    response: string[],
  ) => {
    if (!initialResponses) return;

    const exam = initialResponses.evaluacion.examenes.find((exam) =>
      exam.preguntas.some((q) => q.id === questionId),
    );

    if (!exam) {
      console.error("Could not find exam for question:", questionId);
      return;
    }

    try {
      const requestBody = {
        respuestas: response,
      };
      const token = localStorage.getItem("token");
      const apiResponse = await fetch(
        `${BASE_URL}/respuestas/${initialResponses.id}/examenes/${exam.id}/preguntas/${questionId}/contestaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestBody),
        },
      );

      handleUnauthorized(apiResponse);
      if (!apiResponse.ok) {
        setError(`Error ${apiResponse.status}: ${apiResponse.statusText}`);
        return;
      }

      setResponses((prev) => ({
        ...prev,
        [questionId]: response,
      }));
    } catch (err) {
      console.error("Error updating response:", err);
      setError(err instanceof Error ? err.message : "Error updating response");
    }
  };

  const submitEvaluation = async (postulanteId: string | null) => {
    if (!initialResponses) return;

    if (!postulanteId) {
      setError("No se encontró ID de postulante");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/respuestas/${initialResponses.id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            accion: "finalizar",
          }),
        },
      );

      handleUnauthorized(response);
      if (!response.ok) {
        const errorMsg = `Error ${response.status}: ${response.statusText}`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    initialResponses,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  };
};
