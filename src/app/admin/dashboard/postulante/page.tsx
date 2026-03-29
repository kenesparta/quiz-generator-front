"use client";

import { useState } from "react";
import { usePostulante } from "@/hooks/admin/usePostulante";
import type {
  CreatePostulanteRequest,
  Genero,
  GradoInstruccion,
} from "@/types/postulante";

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
  { value: "no_binario", label: "No Binario" },
];

export default function PostulantePage() {
  const { postulantes, isLoading, error, isCreating, createPostulante } =
    usePostulante();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CreatePostulanteRequest>({
    documento: "",
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    grado_instruccion: "secundaria",
    genero: "masculino",
  });

  const filteredPostulantes = postulantes.filter(
    (p) =>
      p.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.documento.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      alert("Postulante creado correctamente!");
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
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Postulantes
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)] p-6">
          <p className="text-[var(--text-secondary)]">
            Cargando postulantes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Postulantes
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Gestiona la información de los postulantes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors text-sm font-medium"
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
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-[var(--danger)] px-4 py-3 rounded-md mb-6 text-sm">
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

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Nuevo Postulante
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="documento"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Documento *
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="primer_apellido"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Primer Apellido *
                </label>
                <input
                  type="text"
                  id="primer_apellido"
                  name="primer_apellido"
                  value={formData.primer_apellido}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="segundo_apellido"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Segundo Apellido *
                </label>
                <input
                  type="text"
                  id="segundo_apellido"
                  name="segundo_apellido"
                  value={formData.segundo_apellido}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="grado_instruccion"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Grado de Instrucción *
                </label>
                <select
                  id="grado_instruccion"
                  name="grado_instruccion"
                  value={formData.grado_instruccion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
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
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                >
                  Género *
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-colors"
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
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--table-header-bg)] transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
                  isCreating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                }`}
              >
                {isCreating ? "Creando..." : "Crear Postulante"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-color-light)]">
        {/* Search */}
        <div className="px-6 py-4 border-b border-[var(--border-color-light)]">
          <div className="relative max-w-sm">
            <svg
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--border-color)] rounded-md bg-[var(--table-header-bg)] focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        {filteredPostulantes.length === 0 ? (
          <div className="text-center py-12">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-[var(--text-tertiary)] text-sm">
              {searchQuery
                ? "No se encontraron resultados"
                : "No hay postulantes registrados"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[var(--table-header-bg)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Fecha de Nacimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Grado de Instrucción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Género
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPostulantes.map((postulante) => (
                  <tr
                    key={postulante.id}
                    className="border-b border-[var(--border-color-light)] hover:bg-[var(--table-header-bg)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {postulante.documento}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                      {postulante.nombre_completo}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {postulante.fecha_nacimiento}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {postulante.grado_instruccion}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {postulante.genero}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
