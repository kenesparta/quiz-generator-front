"use client";

import { useLogout } from "@/hooks/admin/useLogout";

interface EvaluacionesHeaderProps {
  nombrePostulante?: string;
}

export function EvaluacionesHeader({
  nombrePostulante,
}: EvaluacionesHeaderProps) {
  const { logout, isLoggingOut } = useLogout("/login");

  return (
    <header className="bg-(--sidebar-bg) text-white">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-(--primary) flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-white"
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
            <div>
              <h1 className="text-lg font-semibold">Mis Evaluaciones</h1>
              {nombrePostulante && (
                <p className="text-white/60 text-sm">
                  Bienvenido, {nombrePostulante}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
              isLoggingOut
                ? "border-white/10 text-white/40 cursor-not-allowed"
                : "border-white/20 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            }`}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </header>
  );
}
