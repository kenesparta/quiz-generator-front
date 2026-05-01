"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvaluaciones } from "@/hooks/admin/useEvaluaciones";
import { isAdminOrPsicologo } from "@/utils/jwt";

const estadoStyles: Record<string, { color: string; label: string }> = {
  publicado: { color: "bg-(--success)", label: "Publicado" },
  borrador: { color: "bg-(--warning)", label: "Borrador" },
};

const formatEstado = (estado: string) => {
  const key = estado.toLowerCase();
  return (
    estadoStyles[key] ?? {
      color: "bg-(--text-tertiary)",
      label: estado,
    }
  );
};

export default function EvaluacionPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (!isAdminOrPsicologo(token)) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
  }, [router]);

  const { evaluaciones, isLoading, error } = useEvaluaciones();

  if (authorized === null) {
    return null;
  }

  if (authorized === false) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 border border-(--border-color-light) text-center">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Acceso restringido
          </h2>
          <p className="text-sm text-(--text-tertiary) mt-2">
            Esta sección solo está disponible para administradores y psicólogos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Evaluación
        </h1>
        <p className="text-sm text-(--text-tertiary) mt-1">
          Gestiona las evaluaciones del sistema.
        </p>
      </div>

      {isLoading && (
        <div className="text-sm text-(--text-tertiary)">
          Cargando evaluaciones...
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white rounded-lg p-4 border border-(--border-color-light) text-sm text-(--danger)">
          {error}
        </div>
      )}

      {!isLoading && !error && evaluaciones.length === 0 && (
        <div className="bg-white rounded-lg p-6 border border-(--border-color-light) text-center text-sm text-(--text-tertiary)">
          No hay evaluaciones registradas.
        </div>
      )}

      {!isLoading && !error && evaluaciones.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {evaluaciones.map((evaluacion) => {
            const estado = formatEstado(evaluacion.estado);
            return (
              <div
                key={evaluacion.id}
                className="bg-white rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-(--primary-light) flex items-center justify-center text-(--primary) shrink-0">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      <path d="M9 14l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-(--text-primary) truncate">
                      {evaluacion.nombre}
                    </h3>
                    <p className="text-sm text-(--text-tertiary) mt-1 line-clamp-2">
                      {evaluacion.descripcion}
                    </p>
                    <p className="text-xs text-(--text-tertiary) mt-2">
                      {evaluacion.cantidad_examenes}{" "}
                      {evaluacion.cantidad_examenes === 1
                        ? "examen"
                        : "exámenes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-(--border-color-light)">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className={`w-2 h-2 rounded-full ${estado.color}`} />
                    <span className="text-(--text-secondary)">
                      {estado.label}
                    </span>
                  </span>
                  <span className="text-xs text-(--text-tertiary) font-mono truncate max-w-[140px]">
                    {evaluacion.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
