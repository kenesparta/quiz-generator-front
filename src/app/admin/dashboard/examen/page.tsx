"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useExamenes } from "@/hooks/admin/useExamenes";
import { isAdminOrPsicologo } from "@/utils/jwt";

const estadoStyles: Record<string, { color: string; label: string }> = {
  activo: { color: "bg-(--success)", label: "Activo" },
  borrador: { color: "bg-(--warning)", label: "Borrador" },
  inactivo: { color: "bg-(--text-tertiary)", label: "Inactivo" },
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

export default function ExamenPage() {
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

  const { examenes, isLoading, error } = useExamenes();

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
        <h1 className="text-2xl font-semibold text-(--text-primary)">Examen</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">
          Administra los exámenes y cuestionarios.
        </p>
      </div>

      {isLoading && (
        <div className="text-sm text-(--text-tertiary)">
          Cargando exámenes...
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white rounded-lg p-4 border border-(--border-color-light) text-sm text-(--danger)">
          {error}
        </div>
      )}

      {!isLoading && !error && examenes.length === 0 && (
        <div className="bg-white rounded-lg p-6 border border-(--border-color-light) text-center text-sm text-(--text-tertiary)">
          No hay exámenes registrados.
        </div>
      )}

      {!isLoading && !error && examenes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {examenes.map((examen) => {
            const estado = formatEstado(examen.estado);
            return (
              <div
                key={examen.id}
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
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-(--text-primary) truncate">
                      {examen.titulo}
                    </h3>
                    <p className="text-sm text-(--text-tertiary) mt-1 line-clamp-2">
                      {examen.descripcion}
                    </p>
                    <p className="text-xs text-(--text-tertiary) mt-2">
                      {examen.cantidad_preguntas}{" "}
                      {examen.cantidad_preguntas === 1
                        ? "pregunta"
                        : "preguntas"}
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
                    {examen.id}
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
