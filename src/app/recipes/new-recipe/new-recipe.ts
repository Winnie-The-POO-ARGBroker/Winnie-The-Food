import { Injectable, signal } from '@angular/core';

export type Difficulty = 'facil' | 'medio' | 'dificil' | 'media';

function newId() { return Date.now() + Math.floor(Math.random() * 1000); }

@Injectable({ providedIn: 'root' })
export class NewRecipeStore {
  // Paso 1
  imageFile    = signal<File | null>(null);
  imageDataUrl = signal<string>(''); // preview + guardado local
  name         = signal<string>('');
  description  = signal<string>('');
  category     = signal<string>('otros');
  difficulty   = signal<Difficulty>('facil');
  prepMinutes  = signal<string>('');
  cookMinutes  = signal<string>('');
  servings     = signal<number | null>(null);
  tags         = signal<string>('');

  // Paso 2 - ingredientes (con id estable para trackBy)
  ingredients = signal<{ id: number; name: string; qty: string; unit: string }[]>(
    [{ id: newId(), name: '', qty: '', unit: '' }]
  );

  // Paso 2 - nutrición (editable)
  nutritionItems = signal<{ id: number; label: string; value: string; unit: string }[]>(
    [
      { id: newId(), label: 'Calorías', value: '', unit: 'kcal' },
      { id: newId(), label: 'Proteína', value: '', unit: 'g' },
      { id: newId(), label: 'Carbohidratos', value: '', unit: 'g' },
      { id: newId(), label: 'Grasa', value: '', unit: 'g' },
    ]
  );

  // Paso 3 - pasos y tips (con id estable)
  steps = signal<{ id: number; title: string; description: string }[]>([
    { id: newId(), title: '', description: '' },
  ]);
  tips  = signal<{ id: number; title: string; description: string }[]>([]);

    persistDraft(): void {
    const KEY = 'newRecipe.draft.v1';
    const draft = {
      name: this.name(),
      description: this.description(),
      category: this.category(),
      difficulty: this.difficulty(),
      prepMinutes: this.prepMinutes(),
      cookMinutes: this.cookMinutes(),
      servings: this.servings(),
      tags: this.tags(),
      imageDataUrl: this.imageDataUrl(),
      ingredients: this.ingredients(),
      nutritionItems: this.nutritionItems(),
      steps: this.steps(),
      tips: this.tips()
    };
    localStorage.setItem(KEY, JSON.stringify(draft));
  }
}
