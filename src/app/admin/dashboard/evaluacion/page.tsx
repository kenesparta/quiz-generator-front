export default function EvaluacionPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Evaluación</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Gestiona las evaluaciones del sistema.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">
              Evaluaciones Activas
            </h3>
            <p className="text-blue-700">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Completadas</h3>
            <p className="text-green-700">45</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900">Pendientes</h3>
            <p className="text-yellow-700">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
