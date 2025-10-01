export interface EvaluationResponse {
  _id: string;
  fecha_tiempo_inicio: string;
  fecha_tiempo_fin: string;
  postulante_id: string;
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
  preguntas: Question[];
}

export interface Question {
  _id: string;
  contenido: string;
  tipo_de_pregunta: "alternativa_peso" | "alternativa_unica" | "sola_respuesta";
  etiqueta: string;
  alternativas: Record<string, string>;
  respuestas: string[];
}
