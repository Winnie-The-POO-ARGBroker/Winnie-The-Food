import { Injectable, signal } from '@angular/core';

export type Difficulty = 'facil' | 'media' | 'dificil';
export interface Ingredient { name: string; qty: string; unit: 'g'|'kg'|'ml'|''; }
export interface StepItem { title: string; description: string; }
export interface TipItem { title: string; description: string; }

@Injectable({ providedIn: 'root' })
export class NewRecipeStore {
  // Paso 1
  name = signal<string>('');
  description = signal<string>('');
  category = signal<string>('desayuno');
  difficulty = signal<Difficulty>('facil');
  prepMinutes = signal<string>('');
  cookMinutes = signal<string>('');
  servings = signal<number | null>(null);
  tags = signal<string>('');
  imageFile = signal<File | null>(null);

  // Paso 2
  ingredients = signal<Ingredient[]>([
    { name: '', qty: '', unit: '' },
    { name: '', qty: '', unit: '' },
  ]);

  // Paso 3
  steps = signal<StepItem[]>([{ title: '', description: '' }]);
  tips = signal<TipItem[]>([{ title: '', description: '' }]);

  reset() {
    this.name.set(''); this.description.set('');
    this.category.set('desayuno'); this.difficulty.set('facil');
    this.prepMinutes.set(''); this.cookMinutes.set('');
    this.servings.set(null); this.tags.set(''); this.imageFile.set(null);
    this.ingredients.set([{ name:'', qty:'', unit:'' }, { name:'', qty:'', unit:'' }]);
    this.steps.set([{ title: '', description: '' }]);
    this.tips.set([{ title: '', description: '' }]);
  }
}
