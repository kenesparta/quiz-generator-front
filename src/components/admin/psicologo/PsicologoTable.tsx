import type { PsicologoListItem } from "@/types/psicologo";

interface PsicologoTableProps {
  psicologos: PsicologoListItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PsicologoTable({
  psicologos,
  searchQuery,
  onSearchChange,
}: PsicologoTableProps) {
  const filtered = psicologos.filter((p) => {
    const nombreCompleto =
      `${p.nombre} ${p.primer_apellido} ${p.segundo_apellido}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return (
      nombreCompleto.includes(q) ||
      p.documento.toLowerCase().includes(q) ||
      p.colegiatura.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
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
            placeholder="Buscar por nombre, documento o colegiatura..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-(--border-color) rounded-md bg-(--table-header-bg) focus:bg-white focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-colors"
          />
        </div>
      </div>

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
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-(--text-tertiary) text-sm">
            {searchQuery
              ? "No se encontraron resultados"
              : "No hay psicólogos registrados"}
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
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                  Colegiatura
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((psicologo) => (
                <tr
                  key={psicologo.id}
                  className="border-b border-(--border-color-light) hover:bg-(--table-header-bg) transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-(--text-primary)">
                    {psicologo.documento}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-(--text-primary)">
                    {`${psicologo.nombre} ${psicologo.primer_apellido} ${psicologo.segundo_apellido}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {psicologo.especialidad}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--text-secondary)">
                    {psicologo.colegiatura}
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
