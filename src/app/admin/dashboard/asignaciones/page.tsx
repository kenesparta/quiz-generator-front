"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AsignarEvaluacionModal } from "@/components/admin/AsignarEvaluacionModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAsignaciones } from "@/hooks/admin/useAsignaciones";
import { useEvaluaciones } from "@/hooks/admin/useEvaluaciones";
import { formatFecha } from "@/utils/date";
import { isAdminOrPsicologo } from "@/utils/jwt";

const estadoStyles: Record<string, { color: string; label: string }> = {
  Creado: { color: "bg-(--warning)", label: "Creado" },
  EnProceso: { color: "bg-(--primary)", label: "En proceso" },
  Finalizado: { color: "bg-(--success)", label: "Finalizado" },
};

const formatEstado = (estado: string) =>
  estadoStyles[estado] ?? { color: "bg-(--text-tertiary)", label: estado };

export default function AsignacionesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [evaluacionId, setEvaluacionId] = useState("");
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const { asignaciones, isLoading, error, refetch } = useAsignaciones();
  const { evaluaciones } = useEvaluaciones();

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

  useEffect(() => {
    void refetch({ evaluacion_id: evaluacionId || undefined });
  }, [evaluacionId, refetch]);

  const filtradas = useMemo(() => {
    const q = filtroTexto.trim().toLowerCase();
    if (!q) return asignaciones;
    return asignaciones.filter(
      (a) =>
        a.postulante_nombre_completo.toLowerCase().includes(q) ||
        a.postulante_documento.toLowerCase().includes(q) ||
        a.evaluacion_nombre.toLowerCase().includes(q),
    );
  }, [asignaciones, filtroTexto]);

  const handleAsignarSuccess = () => {
    setShowAsignarModal(false);
    setSuccessOpen(true);
    void refetch({ evaluacion_id: evaluacionId || undefined });
  };

  if (authorized === null) return null;

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
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Asignaciones
          </h1>
          <p className="text-sm text-(--text-tertiary) mt-1">
            Lista de evaluaciones asignadas a postulantes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAsignarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium cursor-pointer"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Asignar Evaluación
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="filtro-texto"
              className="block text-sm font-medium text-(--text-primary) mb-1"
            >
              Buscar
            </label>
            <input
              id="filtro-texto"
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Nombre, documento o evaluación"
              className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="filtro-evaluacion"
              className="block text-sm font-medium text-(--text-primary) mb-1"
            >
              Evaluación
            </label>
            <select
              id="filtro-evaluacion"
              value={evaluacionId}
              onChange={(e) => setEvaluacionId(e.target.value)}
              className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none bg-white"
            >
              <option value="">Todas las evaluaciones</option>
              {evaluaciones.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-sm text-(--text-tertiary)">
          Cargando asignaciones...
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-(--danger-light) border border-(--danger) text-(--danger) px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && filtradas.length === 0 && (
        <div className="bg-white rounded-lg p-6 border border-(--border-color-light) text-center text-sm text-(--text-tertiary)">
          No hay asignaciones que coincidan con los filtros.
        </div>
      )}

      {!isLoading && !error && filtradas.length > 0 && (
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-(--border-color-light)">
              <thead className="bg-(--page-bg)">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Postulante
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Evaluación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Inicio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                    Fin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border-color-light)">
                {filtradas.map((a) => {
                  const estado = formatEstado(a.estado);
                  return (
                    <tr key={a.id} className="hover:bg-(--page-bg)">
                      <td className="px-4 py-3 text-sm text-(--text-primary)">
                        {a.postulante_nombre_completo || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-(--text-secondary) font-mono">
                        {a.postulante_documento || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-(--text-primary)">
                        {a.evaluacion_nombre}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${estado.color}`}
                          />
                          <span className="text-(--text-secondary)">
                            {estado.label}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-(--text-tertiary)">
                        {formatFecha(a.fecha_tiempo_inicio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-(--text-tertiary)">
                        {formatFecha(a.fecha_tiempo_fin)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-(--border-color-light) text-xs text-(--text-tertiary)">
            {filtradas.length} de {asignaciones.length} asignaciones
          </div>
        </div>
      )}

      <AsignarEvaluacionModal
        open={showAsignarModal}
        onClose={() => setShowAsignarModal(false)}
        onSuccess={handleAsignarSuccess}
      />

      <ConfirmDialog
        open={successOpen}
        title="Evaluación asignada"
        message="La evaluación se asignó correctamente al postulante."
        variant="success"
        confirmLabel="Aceptar"
        cancelLabel=""
        onConfirm={() => setSuccessOpen(false)}
        onCancel={() => setSuccessOpen(false)}
      />
    </div>
  );
}
