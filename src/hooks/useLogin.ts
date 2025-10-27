"use client";

import { useState } from "react";

interface LoginRequest {
  user_name: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expires_in: number;
}

interface UseLoginReturn {
  login: (credentials: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/login/postulante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales incorrectas");
      }

      const data: LoginResponse = await response.json();

      // Store token and expiration info
      localStorage.setItem("token", data.token);
      localStorage.setItem("expires_in", data.expires_in.toString());

      window.location.href = "/evaluacion";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};
