export default function PostulantePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Postulante</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Gestiona la información de los postulantes.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Juan Pérez</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  juan@email.com
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    En proceso
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">
                  María García
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  maria@email.com
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Aprobado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
