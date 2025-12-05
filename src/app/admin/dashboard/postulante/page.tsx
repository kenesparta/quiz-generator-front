"use client";

import { useState } from "react";
import { usePostulante } from "@/hooks/admin/usePostulante";
import type {
  CreatePostulanteRequest,
  GradoInstruccion,
  Genero,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Postulantes</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Cargando postulantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Postulantes</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancelar" : "Agregar Postulante"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Nuevo Postulante
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="documento"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="primer_apellido"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="segundo_apellido"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="grado_instruccion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Grado de Instrucción *
                </label>
                <select
                  id="grado_instruccion"
                  name="grado_instruccion"
                  value={formData.grado_instruccion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Género *
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isCreating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isCreating ? "Creando..." : "Crear Postulante"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Gestiona la información de los postulantes.
        </p>

        {postulantes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay postulantes registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Documento
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Nombre Completo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Fecha de Nacimiento
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Grado de Instrucción
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Género
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {postulantes.map((postulante) => (
                  <tr key={postulante.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {postulante.documento}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {postulante.nombre_completo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {postulante.fecha_nacimiento}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {postulante.grado_instruccion}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
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
