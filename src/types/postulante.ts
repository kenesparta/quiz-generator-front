export type GradoInstruccion =
  | "ninguno"
  | "primaria"
  | "secundaria"
  | "superior"
  | "posgrado";

export type Genero = "masculino" | "femenino" | "no_binario";

export interface PostulanteListItem {
  id: string;
  documento: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  grado_instruccion: string;
  genero: string;
}

export interface CreatePostulanteRequest {
  documento: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  grado_instruccion: GradoInstruccion;
  genero: Genero;
}
