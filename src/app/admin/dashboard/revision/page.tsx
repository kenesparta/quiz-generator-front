"use client";

import Link from "next/link";

export default function RevisionPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Lista de Evaluaciones
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          Selecciona una evaluación para revisar las respuestas de los
          postulantes.
        </p>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Evaluación de Matemáticas - Nivel Básico
                </h3>
                <p className="text-sm text-gray-600 mb-2">Fecha: 12/11/2025</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium">Postulantes:</span> 15
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">Completadas:</span> 12
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">Pendientes:</span> 3
                  </span>
                </div>
              </div>
              <Link
                href="/admin/dashboard/revision/d4e92ac2-882a-4e46-ae56-b2361ac5327e"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver Detalles
              </Link>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Evaluación de Programación - JavaScript
                </h3>
                <p className="text-sm text-gray-600 mb-2">Fecha: 10/11/2025</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium">Postulantes:</span> 8
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">Completadas:</span> 8
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">Pendientes:</span> 0
                  </span>
                </div>
              </div>
              <Link
                href="/admin/dashboard/revision/e17439e0-79e1-47e3-b5f9-5b54367fa290"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver Detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
