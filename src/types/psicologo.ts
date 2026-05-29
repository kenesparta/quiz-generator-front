export interface CreatePsicologoRequest {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  documento: string;
  especialidad: string;
  colegiatura: string;
  password: string;
}

export interface PsicologoListItem {
  id: string;
  documento: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  especialidad: string;
  colegiatura: string;
}
