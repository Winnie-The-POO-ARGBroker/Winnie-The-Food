export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface Nutrition {
  label: string;
  value: string;
  unit?: string;
}

export interface Receta {
  id: number;
  autor_id: number;
  nombre: string;
  descripcion: string;
  porciones: number;
  tiempoPrep: number;
  tiempoCoc: number;
  categoria: string;
  dificultad: Dificultad;
  tipo_comida: string;
  publicada: boolean;
  imageUrl: string;
  tags: string[];
  ingredients: string[];
  nutrition: Nutrition[];
  steps: string[];
  tips: string[];
  related: any[];     
  enlace?: string;
}