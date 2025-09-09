import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Featured } from '../../shared/components/featured/featured';


type Difficulty = 'facil' | 'medio' | 'dificil';

export interface Nutrition { label: string; value: number | string; }
export interface RelatedRecipe { titulo: string; descripcion: string; tiempo: string; dificultad: Difficulty; imagen: string; }
export interface Recipe {
  title: string;
  time: string;
  servings: string;
  difficulty: Difficulty;
  tags: string[];
  imageUrl: string;
  ingredients: string[];
  nutrition: Nutrition[];
  steps: string[];
  tips: string[];
  related: RelatedRecipe[];
}

@Component({
  selector: 'app-detail-recipe',
  standalone: true,
  imports: [TitleCasePipe, Featured],
  styleUrl: './detail-recipe.css',
  templateUrl: './detail-recipe.html',
})
export class DetailRecipe {
  // En una integración real, esto viene por id desde un service + ActivatedRoute
  recipe = signal<Recipe>({
    title: 'Tarta de espinaca',
    time: '🕓 45 min de preparación',
    servings: '👥 6-8 porciones',
    difficulty: 'medio',
    tags: ['Vegetariano', 'Hornear', 'Tartas', 'Verduras'],
    imageUrl: '/img-tarta.webp',
    ingredients: [
      '1 masa para tarta (casera o comprada)',
      '500g de espinaca fresca',
      '200g de queso cremoso',
      '150g de queso mozzarella rallado',
      '3 huevos',
      '1 cebolla mediana',
      '2 dientes de ajo',
      '200ml de crema de leche',
      'Sal y pimienta a gusto',
      'Nuez moscada (opcional)',
      '2 cucharadas de aceite de oliva',
    ],
    nutrition: [
      { label: 'Calorías', value: 16 },
      { label: 'Colesterol', value: 16 },
      { label: 'Proteínas', value: 16 },
      { label: 'Grasas', value: 16 },
    ],
    steps: [
      'Precalentar el horno a 180°C y colocar la masa en un molde.',
      'Lavar y escurrir bien las espinacas. Picar groseramente.',
      'Sofreír cebolla y ajo en aceite de oliva.',
      'Agregar espinaca al sartén, condimentar.',
      'Mezclar huevos, crema, queso y unir con espinaca.',
      'Verter sobre la masa y espolvorear mozzarella.',
      'Hornear 30-35 min.',
    ],
    tips: [
      'Usar espinaca congelada si no hay fresca.',
      'Agregar parmesano arriba para gratinar.',
      'Podés reemplazar crema por leche evaporada.',
      'Ideal para freezar en porciones.',
    ],
    related: [
      { titulo: 'Quiche Lorraine', tiempo: '40 min', dificultad: 'medio', imagen: '/img-recipe-1.webp', descripcion: 'Tarta salada francesa con panceta y queso.' },
      { titulo: 'Tarta de Jamón y Queso', tiempo: '35 min', dificultad: 'facil', imagen: '/img-recipe-2.webp', descripcion: 'Tarta salada francesa con panceta y queso.' },
      { titulo: 'Tarta de Cebolla Caramelizada', tiempo: '50 min', dificultad: 'dificil', imagen: '/img-recipe-3.webp', descripcion: 'Tarta salada francesa con panceta y queso.' },
    ],
  });

  toastVisible = signal(false);

  onAddToFavorites() {
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }

  // helper para clase de dificultad
  difficultyClass(d: Difficulty) {
    return d; // 'facil' | 'medio' | 'dificil' → se usa junto a .circulo
  }
}

