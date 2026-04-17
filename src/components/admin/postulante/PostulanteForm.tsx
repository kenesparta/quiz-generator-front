"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
  CreatePostulanteRequest,
  Genero,
  GradoInstruccion,
} from "@/types/postulante";

const calcularEdad = (fechaNacimiento: string): number | null => {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - nacimiento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const GRADO_INSTRUCCION_OPTIONS: { value: GradoInstruccion; label: string }[] =
  [
    { value: "ninguno", label: "Ninguno" },
    { value: "primaria", label: "Primaria" },
    { value: "secundaria", label: "Secundaria" },
    { value: "superior", label: "Superior" },
    { value: "posgrado", label: "Posgrado" },
  ];

const GENERO_OPTIONS: { value: Genero; label: string }[] = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "nobinario", label: "No Binario" },
];

interface PostulanteFormProps {
  open: boolean;
  formData: CreatePostulanteRequest;
  isCreating: boolean;
  isEditMode: boolean;
  isSearching: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSearch: () => void;
}

export function PostulanteForm({
  open,
  formData,
  isCreating,
  isEditMode,
  isSearching,
  onInputChange,
  onSubmit,
  onCancel,
  onSearch,
}: PostulanteFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const edad = useMemo(
    () => calcularEdad(formData.fecha_nacimiento),
    [formData.fecha_nacimiento],
  );
  const esMenor = edad !== null && edad < 18;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onCancel}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto max-w-2xl w-full open:animate-[fadeIn_150ms_ease-out]"
    >
      <div className="bg-white rounded-lg shadow-xl border border-(--border-color-light) p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            {isEditMode ? "Editar Postulante" : "Nuevo Postulante"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="documento"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Documento *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={onInputChange}
                  required
                  disabled={isEditMode}
                  className="flex-1 px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={!formData.documento.trim() || isSearching}
                  title="Buscar postulante por documento"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !formData.documento.trim() || isSearching
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-(--primary) text-white hover:bg-(--primary-dark) cursor-pointer"
                  }`}
                >
                  {isSearching ? (
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
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
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="primer_apellido"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Primer Apellido *
              </label>
              <input
                type="text"
                id="primer_apellido"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="segundo_apellido"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Segundo Apellido *
              </label>
              <input
                type="text"
                id="segundo_apellido"
                name="segundo_apellido"
                value={formData.segundo_apellido}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="fecha_nacimiento"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
              {edad !== null && (
                <p
                  className={`text-xs mt-1 ${esMenor ? "text-(--danger)" : "text-(--text-tertiary)"}`}
                >
                  Edad: {edad} {edad === 1 ? "año" : "años"}
                </p>
              )}
              {esMenor && (
                <p className="text-xs mt-1 text-(--danger) font-medium">
                  El postulante debe ser mayor de 18 años.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="grado_instruccion"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Grado de Instrucción *
              </label>
              <select
                id="grado_instruccion"
                name="grado_instruccion"
                value={formData.grado_instruccion}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              >
                {GRADO_INSTRUCCION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="genero"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Género *
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              >
                {GENERO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-(--border-color) text-(--text-primary) rounded-md hover:bg-(--table-header-bg) transition-colors text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || esMenor}
              className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
                isCreating || esMenor
                  ? "bg-(--neutral-400) cursor-not-allowed"
                  : "bg-(--primary) hover:bg-(--primary-dark) cursor-pointer"
              }`}
            >
              {isCreating
                ? isEditMode
                  ? "Actualizando..."
                  : "Creando..."
                : isEditMode
                  ? "Actualizar Postulante"
                  : "Crear Postulante"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
