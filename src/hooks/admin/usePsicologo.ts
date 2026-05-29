"use client";

import { useState } from "react";
import { BASE_URL } from "@/config/api";
import type { CreatePsicologoRequest } from "@/types/psicologo";

interface UsePsicologoReturn {
  isCreating: boolean;
  error: string | null;
  clearError: () => void;
  createPsicologo: (data: CreatePsicologoRequest) => Promise<boolean>;
}

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const usePsicologo = (): UsePsicologoReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    isCreating,
    error,
    clearError: () => setError(null),
    createPsicologo,
  };
};
