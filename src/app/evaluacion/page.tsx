"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorCard } from "@/components/evaluacion/ErrorCard";
import { EvaluacionCard } from "@/components/evaluacion/EvaluacionCard";
import { EvaluacionesEmpty } from "@/components/evaluacion/EvaluacionesEmpty";
import { EvaluacionesHeader } from "@/components/evaluacion/EvaluacionesHeader";
import { LoadingSpinner } from "@/components/evaluacion/LoadingSpinner";
import { useListaEvaluaciones } from "@/hooks/useListaEvaluaciones";
import { usePostulante } from "@/hooks/usePostulante";
import { getSubFromJWT } from "@/utils/jwt";

export default function EvaluacionesPage() {
  const router = useRouter();
  const [postulanteId, setPostulanteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = getSubFromJWT(token);
    if (!id) {
      router.push("/login");
      return;
    }
    setPostulanteId(id);
  }, [router]);

  const { postulante, isLoading: postulanteLoading } =
    usePostulante(postulanteId);
  const { evaluaciones, isLoading, error, startEvaluacion, isStarting } =
    useListaEvaluaciones(postulanteId);

  const handleStartEvaluacion = async (respuestaId: string) => {
    const success = await startEvaluacion(respuestaId);
    if (success) {
      router.push(`/evaluacion/${respuestaId}`);
    }
  };

  if (isLoading || postulanteLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <div className="min-h-screen bg-(--page-bg)">
      <EvaluacionesHeader nombrePostulante={postulante?.nombre} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {evaluaciones.length === 0 ? (
          <EvaluacionesEmpty />
        ) : (
          <div className="space-y-3">
            {evaluaciones.map((evaluacion) => (
              <EvaluacionCard
                key={evaluacion.respuesta_id}
                respuestaId={evaluacion.respuesta_id}
                nombreEvaluacion={evaluacion.nombre_evaluacion}
                descripcionEvaluacion={evaluacion.descripcion_evaluacion}
                estado={evaluacion.estado}
                isStarting={isStarting}
                onStart={handleStartEvaluacion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
