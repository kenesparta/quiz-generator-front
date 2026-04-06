export default function EvaluacionPage() {
  const metrics = [
    {
      label: "Evaluaciones Activas",
      value: 12,
      trend: "+2 esta semana",
      trendUp: true,
      bgColor: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
      icon: (
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
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      label: "Completadas",
      value: 45,
      trend: "+8 este mes",
      trendUp: true,
      bgColor: "bg-(--success-light)",
      iconColor: "text-(--success)",
      icon: (
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
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    {
      label: "Pendientes",
      value: 8,
      trend: "-3 vs. semana pasada",
      trendUp: false,
      bgColor: "bg-(--warning-light)",
      iconColor: "text-(--warning)",
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
  ];

  const activities = [
    {
      color: "bg-(--success-light)0",
      text: "Evaluación de Matemáticas completada por Juan Pérez",
      time: "Hace 2 horas",
    },
    {
      color: "bg-(--warning)",
      text: "María García inició la Evaluación de Historia",
      time: "Hace 4 horas",
    },
    {
      color: "bg-(--primary)",
      text: "Nueva evaluación de Ciencias creada",
      time: "Hace 6 horas",
    },
    {
      color: "bg-(--success-light)0",
      text: "Carlos López finalizó su evaluación",
      time: "Ayer",
    },
    {
      color: "bg-(--neutral-400)",
      text: "Evaluación de Geografía programada para revisión",
      time: "Ayer",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Evaluación
        </h1>
        <p className="text-sm text-(--text-tertiary) mt-1">
          Gestiona las evaluaciones del sistema.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-(--text-tertiary)">
                {metric.label}
              </span>
              <div
                className={`w-10 h-10 rounded-full ${metric.bgColor} flex items-center justify-center ${metric.iconColor}`}
              >
                {metric.icon}
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-(--text-primary)">
                {metric.value}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <svg
                aria-hidden="true"
                className={`w-3 h-3 ${metric.trendUp ? "text-(--success)" : "text-(--danger)"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={metric.trendUp ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
              <span className="text-xs text-(--text-tertiary)">
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-(--border-color-light)">
        <div className="px-6 py-4 border-b border-(--border-color-light)">
          <h2 className="text-base font-semibold text-(--text-primary)">
            Actividad Reciente
          </h2>
        </div>
        <div className="divide-y divide-(--border-color-light)">
          {activities.map((activity) => (
            <div
              key={activity.text}
              className="px-6 py-4 flex items-start gap-3"
            >
              <span
                className={`w-2 h-2 rounded-full ${activity.color} mt-1.5 shrink-0`}
              />
              <div>
                <p className="text-sm text-(--text-primary)">{activity.text}</p>
                <p className="text-xs text-(--text-tertiary) mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
