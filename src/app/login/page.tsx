"use client";

import type React from "react";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    await login({
      user_name: userName,
      password,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--sidebar-bg)] relative overflow-hidden">
        <div className="flex flex-col justify-center px-16 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12l-2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-xl">
              Quiz Generator
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Plataforma de
            <br />
            Evaluaciones
          </h1>
          <p className="text-white/60 text-lg max-w-md">
            Accede a tus evaluaciones asignadas y completa los cuestionarios de
            forma segura.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[var(--primary)]/10" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--primary)]/5" />
      </div>

      {/* Right login form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-[var(--page-bg)]">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12l-2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-[var(--text-primary)] font-semibold text-xl">
              Quiz Generator
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              Accede para comenzar la evaluación
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)] p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center gap-2 bg-[var(--danger-light)] border border-[var(--danger-border)] text-[var(--danger)] px-4 py-3 rounded-md text-sm">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="user_name"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                >
                  DNI
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  autoComplete="username"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm placeholder-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  placeholder="123245678"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm placeholder-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Iniciando...
                  </div>
                ) : (
                  "Comenzar la Evaluación"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
