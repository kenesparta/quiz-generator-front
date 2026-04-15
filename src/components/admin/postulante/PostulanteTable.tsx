import type { PostulanteListItem } from "@/types/postulante";

interface PostulanteTableProps {
  postulantes: PostulanteListItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PostulanteTable({
  postulantes,
  searchQuery,
  onSearchChange,
}: PostulanteTableProps) {
  const filtered = postulantes.filter(
    (p) =>
      p.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.documento.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
      {/* Search */}
      <div className="px-6 py-4 border-b border-(--border-color-light)">
        <div className="relative max-w-sm">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary)"
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-(--border-color) rounded-md bg-(--table-header-bg) focus:bg-white focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-(--text-tertiary) text-sm">
            {searchQuery
              ? "No se encontraron resultados"
              : "No hay postulantes registrados"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-(--table-header-bg)">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Fecha de Nacimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Grado de Instrucción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Fecha de Registro
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((postulante) => (
                <tr
                  key={postulante.id}
                  className="border-b border-(--border-color-light) hover:bg-(--table-header-bg) transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-(--text-primary)">
                    {postulante.documento}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-(--text-primary)">
                    {postulante.nombre_completo}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {postulante.fecha_nacimiento}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {postulante.grado_instruccion}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {postulante.genero}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {postulante.fecha_registro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
