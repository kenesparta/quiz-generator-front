const estadoConfig: Record<string, { color: string; label: string }> = {
  creado: { color: "bg-(--primary)", label: "Pendiente" },
  en_progreso: { color: "bg-(--warning)", label: "En Progreso" },
  completado: { color: "bg-(--success)", label: "Completado" },
};

interface EstadoDotProps {
  estado: string;
}

export function EstadoDot({ estado }: EstadoDotProps) {
  const { color, label } = estadoConfig[estado] || {
    color: "bg-(--neutral-400)",
    label: estado,
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-(--text-secondary)">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
