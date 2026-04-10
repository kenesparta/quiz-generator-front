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

interface PostulanteFormProps {
  formData: CreatePostulanteRequest;
  isCreating: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PostulanteForm({
  formData,
  isCreating,
  onInputChange,
  onSubmit,
  onCancel,
}: PostulanteFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) p-6 mb-6">
      <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
        Nuevo Postulante
      </h2>
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
            disabled={isCreating}
            className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
              isCreating
                ? "bg-(--neutral-400) cursor-not-allowed"
                : "bg-(--primary) hover:bg-(--primary-dark) cursor-pointer"
            }`}
          >
            {isCreating ? "Creando..." : "Crear Postulante"}
          </button>
        </div>
      </form>
    </div>
  );
}
