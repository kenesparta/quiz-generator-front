export interface EvaluationResponse {
  _id: string;
  fecha_tiempo_inicio: string;
  fecha_tiempo_transcurrido: number;
  fecha_tiempo_fin: string;
  postulante_id: string;
  resultado: string;
  evaluacion: Evaluation;
}

export interface Evaluation {
  _id: string;
  nombre: string;
  descripcion: string;
  examenes: Exam[];
}

export interface Exam {
  _id: string;
  titulo: string;
  descripcion: string;
  instrucciones: string;
  puntos_obtenidos: number;
  preguntas: Question[];
  observacion?: string;
}

export interface Question {
  _id: string;
  contenido: string;
  tipo_de_pregunta: "alternativa_peso" | "alternativa_unica" | "sola_respuesta";
  etiqueta: string;
  alternativas: Record<string, string>;
  respuestas: string[];
  puntos: number;
}
