"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAsignarEvaluacion } from "@/hooks/admin/useAsignarEvaluacion";
import { useEvaluaciones } from "@/hooks/admin/useEvaluaciones";
import { usePostulante } from "@/hooks/admin/usePostulante";

interface AsignarEvaluacionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AsignarEvaluacionModal({
  open,
  onClose,
  onSuccess,
}: AsignarEvaluacionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [evaluacionId, setEvaluacionId] = useState("");
  const [postulanteId, setPostulanteId] = useState("");
  const [postulanteFilter, setPostulanteFilter] = useState("");

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
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const resetForm = useCallback(() => {
    setEvaluacionId("");
    setPostulanteId("");
    setPostulanteFilter("");
    reset();
  }, [reset]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        handleClose();
      }
    },
    [handleClose],
  );

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

  const isLoading = loadingEvaluaciones || loadingPostulantes;
  const loadError = errorEvaluaciones || errorPostulantes;
  const canSubmit =
    !!evaluacionId && !!postulanteId && !isAssigning && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluacionId || !postulanteId) return;
    const ok = await asignar({
      evaluacion_id: evaluacionId,
      postulante_id: postulanteId,
    });
    if (ok) {
      resetForm();
      onSuccess();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleClose}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto max-w-2xl w-full open:animate-[fadeIn_150ms_ease-out]"
    >
      <div className="bg-white rounded-lg shadow-xl border border-(--border-color-light) p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Asignar Evaluación
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

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
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-(--border-color) text-(--text-primary) rounded-md hover:bg-(--table-header-bg) transition-colors text-sm cursor-pointer"
            >
              Cancelar
            </button>
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
    </dialog>
  );
}
