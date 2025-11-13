export default function ExamenPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Examen</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Administra los exámenes y cuestionarios.
        </p>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">
              Examen de Matemáticas
            </h3>
            <p className="text-gray-600">20 preguntas - Duración: 60 min</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Activo
            </span>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Examen de Historia</h3>
            <p className="text-gray-600">15 preguntas - Duración: 45 min</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Borrador
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
