"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PsicologoForm } from "@/components/admin/psicologo/PsicologoForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { usePsicologo } from "@/hooks/admin/usePsicologo";
import type { CreatePsicologoRequest } from "@/types/psicologo";
import { getRolFromJWT } from "@/utils/jwt";

const emptyFormData: CreatePsicologoRequest = {
  documento: "",
  nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  especialidad: "",
  colegiatura: "",
  password: "",
};

export default function PsicologoPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { isCreating, error, createPsicologo, clearError } = usePsicologo();
  const [showForm, setShowForm] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<CreatePsicologoRequest>({
    ...emptyFormData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = getRolFromJWT(token);
    if (rol !== "admin") {
      router.replace("/admin/dashboard");
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ ...emptyFormData });
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await createPsicologo(formData);
    if (ok) {
      setSuccessDialog(true);
      setShowForm(false);
      setFormData({ ...emptyFormData });
    }
  };

  if (authorized === null) {
    return (
      <div className="p-6">
        <p className="text-(--text-secondary) text-sm">
          Verificando permisos...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Psicólogos
          </h1>
          <p className="text-sm text-(--text-tertiary) mt-1">
            Solo los administradores pueden registrar psicólogos. El
            administrador define la contraseña inicial.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
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
          Agregar Psicólogo
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-(--danger-light) border border-(--danger-border) text-(--danger) px-4 py-3 rounded-md mb-6 text-sm">
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

      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) p-12 text-center">
        <svg
          aria-hidden="true"
          className="w-12 h-12 text-(--neutral-300) mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <p className="text-(--text-secondary) text-sm">
          Usa el botón "Agregar Psicólogo" para registrar un nuevo psicólogo en
          el sistema.
        </p>
      </div>

      <PsicologoForm
        open={showForm}
        formData={formData}
        isCreating={isCreating}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={successDialog}
        title="Psicólogo registrado"
        message="El psicólogo se ha creado correctamente."
        variant="success"
        confirmLabel="Aceptar"
        cancelLabel=""
        onConfirm={() => setSuccessDialog(false)}
        onCancel={() => setSuccessDialog(false)}
      />
    </div>
  );
}
