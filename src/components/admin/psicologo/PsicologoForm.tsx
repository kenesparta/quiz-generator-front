"use client";

import { useEffect, useRef, useState } from "react";
import type { CreatePsicologoRequest } from "@/types/psicologo";

interface PsicologoFormProps {
  open: boolean;
  formData: CreatePsicologoRequest;
  isCreating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PsicologoForm({
  open,
  formData,
  isCreating,
  onInputChange,
  onSubmit,
  onCancel,
}: PsicologoFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      setShowPassword(false);
    }
  }, [open]);

  const passwordTooShort =
    formData.password.length > 0 && formData.password.length < 8;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto max-w-2xl w-full open:animate-[fadeIn_150ms_ease-out]"
    >
      <div className="bg-white rounded-lg shadow-xl border border-(--border-color-light) p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Nuevo Psicólogo
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
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
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
                htmlFor="especialidad"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Especialidad *
              </label>
              <input
                type="text"
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="colegiatura"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Colegiatura *
              </label>
              <input
                type="text"
                id="colegiatura"
                name="colegiatura"
                value={formData.colegiatura}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-(--text-primary) mb-1"
              >
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onInputChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-(--border-color) rounded-md text-sm focus:ring-1 focus:ring-(--primary) focus:border-(--primary) outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  title={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordTooShort && (
                <p className="text-xs mt-1 text-(--danger)">
                  La contraseña debe tener al menos 8 caracteres.
                </p>
              )}
              <p className="text-xs mt-1 text-(--text-tertiary)">
                El administrador define la contraseña inicial del psicólogo.
              </p>
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
              disabled={isCreating || passwordTooShort}
              className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
                isCreating || passwordTooShort
                  ? "bg-(--neutral-400) cursor-not-allowed"
                  : "bg-(--primary) hover:bg-(--primary-dark) cursor-pointer"
              }`}
            >
              {isCreating ? "Creando..." : "Crear Psicólogo"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
