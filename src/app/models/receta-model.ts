export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface IngredientItem { orden: number; texto: string; }
export interface StepItem       { orden: number; texto: string; }
export interface TipItem        { orden: number; texto: string; }
export interface NutritionItem  { label: string; valueNum: number | null; }

export interface Receta {
  id: number | string;
  autor_id: string | number;
  nombre: string;
  descripcion: string;
  porciones?: number | null;
  tiempoPrep?: number | null;
  tiempoCoc?: number | null;
  categoria?: number | null | string;
  dificultad: Dificultad | 1 | 2 | 3;
  tipo?: number | null | string;
  publicada: boolean;
  imageUrl?: string | null;

  tags?: string[];
  ingredients?: IngredientItem[];
  nutrition?: NutritionItem[];
  steps?: StepItem[];
  tips?: TipItem[];
  related?: Array<{
    titulo: string;
    descripcion?: string | null;
    tiempo?: string | null;
    dificultad?: Dificultad | 1 | 2 | 3;
    imagen?: string | null;
    enlace?: string | null;
  }>;

  enlace?: string | null;
  creado_en?: string;
}
