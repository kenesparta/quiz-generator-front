"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAsignarEvaluacion } from "@/hooks/admin/useAsignarEvaluacion";
import { useEvaluaciones } from "@/hooks/admin/useEvaluaciones";
import { usePostulante } from "@/hooks/admin/usePostulante";
import { isAdminOrPsicologo } from "@/utils/jwt";

export default function AsignarEvaluacionPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const [evaluacionId, setEvaluacionId] = useState("");
  const [postulanteId, setPostulanteId] = useState("");
  const [postulanteFilter, setPostulanteFilter] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    evaluaciones,
    isLoading: loadingEvaluaciones,
    error: errorEvaluaciones,
  } = useEvaluaciones();
  const {
    postulantes,
    isLoading: loadingPostulantes,
    error: errorPostulantes,
  } = usePostulante();
  const {
    asignar,
    isAssigning,
    error: errorAsignar,
    reset,
  } = useAsignarEvaluacion();

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

  const filteredPostulantes = useMemo(() => {
    const query = postulanteFilter.trim().toLowerCase();
    if (!query) return postulantes;
    return postulantes.filter((p) => {
      return (
        p.nombre_completo.toLowerCase().includes(query) ||
        p.documento.toLowerCase().includes(query)
      );
    });
  }, [postulantes, postulanteFilter]);

  const evaluacionSeleccionada = useMemo(
    () => evaluaciones.find((e) => e.id === evaluacionId) ?? null,
    [evaluaciones, evaluacionId],
  );

  const postulanteSeleccionado = useMemo(
    () => postulantes.find((p) => p.id === postulanteId) ?? null,
    [postulantes, postulanteId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluacionId || !postulanteId) return;
    const ok = await asignar({
      evaluacion_id: evaluacionId,
      postulante_id: postulanteId,
    });
    if (ok) {
      setSuccessOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setEvaluacionId("");
    setPostulanteId("");
    setPostulanteFilter("");
    reset();
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

  const isLoading = loadingEvaluaciones || loadingPostulantes;
  const loadError = errorEvaluaciones || errorPostulantes;
  const canSubmit =
    !!evaluacionId && !!postulanteId && !isAssigning && !isLoading;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Asignar Evaluación
        </h1>
        <p className="text-sm text-(--text-tertiary) mt-1">
          Asigna una evaluación a un postulante para que pueda rendirla.
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) max-w-3xl">
        {isLoading && (
          <div className="text-sm text-(--text-tertiary) mb-4">
            Cargando datos...
          </div>
        )}

        {loadError && !isLoading && (
          <div className="bg-(--danger-light) border border-(--danger) text-(--danger) px-4 py-3 rounded-md text-sm mb-4">
            {loadError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="evaluacion"
              className="block text-sm font-medium text-(--text-primary) mb-1"
            >
              Evaluación *
            </label>
            <select
              id="evaluacion"
              value={evaluacionId}
              onChange={(e) => setEvaluacionId(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none bg-white disabled:bg-(--page-bg) disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una evaluación</option>
              {evaluaciones.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.nombre}
                </option>
              ))}
            </select>
            {evaluacionSeleccionada && (
              <p className="text-xs text-(--text-tertiary) mt-1.5">
                {evaluacionSeleccionada.descripcion} ·{" "}
                {evaluacionSeleccionada.cantidad_examenes}{" "}
                {evaluacionSeleccionada.cantidad_examenes === 1
                  ? "examen"
                  : "exámenes"}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="postulante-filter"
              className="block text-sm font-medium text-(--text-primary) mb-1"
            >
              Buscar postulante
            </label>
            <input
              id="postulante-filter"
              type="text"
              value={postulanteFilter}
              onChange={(e) => setPostulanteFilter(e.target.value)}
              placeholder="Filtrar por nombre o documento"
              className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="postulante"
              className="block text-sm font-medium text-(--text-primary) mb-1"
            >
              Postulante *
            </label>
            <select
              id="postulante"
              value={postulanteId}
              onChange={(e) => setPostulanteId(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none bg-white disabled:bg-(--page-bg) disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un postulante</option>
              {filteredPostulantes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_completo} — {p.documento}
                </option>
              ))}
            </select>
            {postulanteSeleccionado && (
              <p className="text-xs text-(--text-tertiary) mt-1.5">
                Documento: {postulanteSeleccionado.documento}
              </p>
            )}
            {postulanteFilter &&
              filteredPostulantes.length === 0 &&
              !isLoading && (
                <p className="text-xs text-(--text-tertiary) mt-1.5">
                  No hay postulantes que coincidan con el filtro.
                </p>
              )}
          </div>

          {errorAsignar && (
            <div className="bg-(--danger-light) border border-(--danger) text-(--danger) px-4 py-3 rounded-md text-sm">
              {errorAsignar}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
                canSubmit
                  ? "bg-(--primary) hover:bg-(--primary-dark) cursor-pointer"
                  : "bg-(--text-tertiary) cursor-not-allowed"
              }`}
            >
              {isAssigning ? "Asignando..." : "Asignar evaluación"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={successOpen}
        title="Evaluación asignada"
        message="La evaluación se asignó correctamente al postulante."
        variant="success"
        confirmLabel="Aceptar"
        cancelLabel=""
        onConfirm={handleSuccessClose}
        onCancel={handleSuccessClose}
      />
    </div>
  );
}
