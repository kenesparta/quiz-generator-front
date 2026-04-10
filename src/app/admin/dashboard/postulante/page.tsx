"use client";

import { useState } from "react";
import { PostulanteForm } from "@/components/admin/postulante/PostulanteForm";
import { PostulanteTable } from "@/components/admin/postulante/PostulanteTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { usePostulante } from "@/hooks/admin/usePostulante";
import type { CreatePostulanteRequest } from "@/types/postulante";

export default function PostulantePage() {
  const { postulantes, isLoading, error, isCreating, createPostulante } =
    usePostulante();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<CreatePostulanteRequest>({
    documento: "",
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    grado_instruccion: "secundaria",
    genero: "masculino",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createPostulante(formData);

    if (success) {
      setSuccessDialog(true);
      setShowForm(false);
      setFormData({
        documento: "",
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        fecha_nacimiento: "",
        grado_instruccion: "secundaria",
        genero: "masculino",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Postulantes
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) p-6">
          <p className="text-(--text-secondary)">Cargando postulantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Postulantes
          </h1>
          <p className="text-sm text-(--text-tertiary) mt-1">
            Gestiona la información de los postulantes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-md hover:bg-(--primary-dark) transition-colors text-sm font-medium cursor-pointer"
        >
          {showForm ? (
            "Cancelar"
          ) : (
            <>
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
              Agregar Postulante
            </>
          )}
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

      {showForm && (
        <PostulanteForm
          formData={formData}
          isCreating={isCreating}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <PostulanteTable
        postulantes={postulantes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ConfirmDialog
        open={successDialog}
        title="Postulante creado"
        message="El postulante se ha creado correctamente."
        variant="success"
        confirmLabel="Aceptar"
        cancelLabel=""
        onConfirm={() => setSuccessDialog(false)}
        onCancel={() => setSuccessDialog(false)}
      />
    </div>
  );
}
