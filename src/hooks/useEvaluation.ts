"use client";

import { useState, useEffect } from "react";
import { EvaluationResponse } from "@/types/evaluacion";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const useEvaluation = () => {
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
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
        const postulanteId = "e17439e0-79e1-47e3-b5f9-5b54367fa290";

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
        setEvaluation(data);

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

    loadEvaluation();
  }, []);

  const updateResponse = (questionId: string, response: string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const submitEvaluation = async () => {
    if (!evaluation) return;

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
        ...evaluation,
        fecha_tiempo_fin: new Date().toISOString(),
        evaluacion: {
          ...evaluation.evaluacion,
          examenes: evaluation.evaluacion.examenes.map((exam) => ({
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
    evaluation,
    responses,
    loading,
    error,
    submitting,
    updateResponse,
    submitEvaluation,
  };
};
