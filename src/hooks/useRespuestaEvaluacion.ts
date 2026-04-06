"use client";

import { useState, useEffect } from "react";
import { EvaluationResponse } from "@/types/evaluacion";
import { BASE_URL, handleUnauthorized } from "@/config/api";

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
          throw new Error(`Error ${response.status}: ${response.statusText}`);
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
  }, [postulanteId]);

  const updateResponse = async (
    postulanteId: string | null,
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
        throw new Error(
          `Error ${apiResponse.status}: ${apiResponse.statusText}`,
        );
      }

      setResponses((prev) => ({
        ...prev,
        [questionId]: response,
      }));
    } catch (error) {
      console.error("Error updating response:", error);
      setError(
        error instanceof Error ? error.message : "Error updating response",
      );
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
      const updatedEvaluation = {
        ...initialResponses,
        fecha_tiempo_fin: new Date().toISOString(),
        evaluacion: {
          ...initialResponses.evaluacion,
          examenes: initialResponses.evaluacion.examenes.map((exam) => ({
            ...exam,
            preguntas: exam.preguntas.map((question) => ({
              ...question,
              respuestas: responses[question.id] || [],
            })),
          })),
        },
      };

      const response = await fetch(
        `${BASE_URL}/respuesta/${initialResponses.id}/finalizar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvaluation),
        },
      );

      handleUnauthorized(response);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar la evaluación",
      );
      throw err;
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
