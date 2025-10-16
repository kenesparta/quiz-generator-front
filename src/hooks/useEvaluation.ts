"use client";

import { useState, useEffect } from "react";
import { EvaluationResponse } from "@/types/evaluacion";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const useEvaluation = (postulanteId: string) => {
  const [initialResponses, setInitialResponses] = useState<EvaluationResponse | null>(null);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        // todo: get postulanteId from session storage
        // const postulanteId = localStorage.getItem('postulanteId') ||
        //   sessionStorage.getItem('postulanteId');
        if (!postulanteId) {
          setError(
            "No se encontró ID de postulante. Por favor, inicie sesión.",
          );
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/respuesta/${postulanteId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: EvaluationResponse = await response.json();
        setInitialResponses(data);

        // Initialize responses with existing answers
        const initialResponses: Record<string, string[]> = {};
        data.evaluacion.examenes.forEach((exam) => {
          exam.preguntas.forEach((question) => {
            initialResponses[question._id] = question.respuestas || [];
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
  }, []);

  const updateResponse = async (postulanteId: string, questionId: string, response: string[]) => {
    if (!initialResponses) return;

    const exam = initialResponses.evaluacion.examenes.find(exam =>
      exam.preguntas.some(q => q._id === questionId)
    );

    if (!exam) {
      console.error('Could not find exam for question:', questionId);
      return;
    }

    try {
      const requestBody = {
        id: initialResponses._id,
        evaluacion_id: initialResponses.evaluacion._id,
        examen_id: exam._id,
        pregunta_id: questionId,
        respuestas: response
      };

      const apiResponse = await fetch(`${BASE_URL}/respuesta/${postulanteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        throw new Error(`Error ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      setResponses((prev) => ({
        ...prev,
        [questionId]: response,
      }));
    } catch (error) {
      console.error('Error updating response:', error);
      setError(error instanceof Error ? error.message : 'Error updating response');
    }
  };

  const submitEvaluation = async () => {
    if (!initialResponses) return;

    const postulanteId =
      localStorage.getItem("postulanteId") ||
      sessionStorage.getItem("postulanteId");

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
              respuestas: responses[question._id] || [],
            })),
          })),
        },
      };

      const response = await fetch(`${BASE_URL}/respuesta/${postulanteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvaluation),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
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
