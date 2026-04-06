export default function ExamenPage() {
  const exams = [
    {
      name: "Examen de Matemáticas",
      description: "20 preguntas - Duración: 60 min",
      status: "Activo",
      dotColor: "bg-(--success)",
    },
    {
      name: "Examen de Historia",
      description: "15 preguntas - Duración: 45 min",
      status: "Borrador",
      dotColor: "bg-(--warning)",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--text-primary)">Examen</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">
          Administra los exámenes y cuestionarios.
        </p>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.name}
            className="bg-white rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light) hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-(--primary-light) flex items-center justify-center text-(--primary) shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-(--text-primary)">
                  {exam.name}
                </h3>
                <p className="text-sm text-(--text-tertiary) mt-1">
                  {exam.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-(--border-color-light)">
              <span className="inline-flex items-center gap-1.5 text-sm">
                <span className={`w-2 h-2 rounded-full ${exam.dotColor}`} />
                <span className="text-(--text-secondary)">{exam.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
