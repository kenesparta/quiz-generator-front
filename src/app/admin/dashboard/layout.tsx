"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("evaluacion");

  const sections = [
    { id: "evaluacion", name: "Evaluación" },
    { id: "examen", name: "Examen" },
    { id: "postulante", name: "Postulante" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "evaluacion":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Evaluación
            </h1>
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
      case "examen":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Examen</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                Administra los exámenes y cuestionarios.
              </p>
              {/* Add your Examen content here */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">
                    Examen de Matemáticas
                  </h3>
                  <p className="text-gray-600">
                    20 preguntas - Duración: 60 min
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Activo
                  </span>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">
                    Examen de Historia
                  </h3>
                  <p className="text-gray-600">
                    15 preguntas - Duración: 45 min
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Borrador
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case "postulante":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Postulante
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                Gestiona la información de los postulantes.
              </p>
              {/* Add your Postulante content here */}
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
                      <td className="px-4 py-2 text-sm text-gray-900">
                        Juan Pérez
                      </td>
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
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-6 bg-blue-600">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="text-sm">{section.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
