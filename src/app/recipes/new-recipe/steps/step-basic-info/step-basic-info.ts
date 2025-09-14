import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.js';

type Dificultad = 'facil' | 'media' | 'dificil';
type UiNutrition = { id: number; label: string; value: string; unit: string };

@Component({
  selector: 'app-step-basic-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-basic-info.html',
  styleUrls: ['../../new-recipe.css', './step-basic-info.css'],
})
export class StepBasicInfo {
  constructor(public store: NewRecipeStore) {}

  // Imagen + previsualización
  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.store.imageFile.set(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.store.imageDataUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.store.imageDataUrl.set('');
    }
  }


  updateName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.name.set(value);
  }
  updateDescription(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.store.description.set(value);
  }


  updateCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.category.set(value);
  }
  updateDifficulty(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Dificultad;
    this.store.difficulty.set(value);
  }


  updatePrepMinutes(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.prepMinutes.set(value);
  }
  updateCookMinutes(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.cookMinutes.set(value);
  }


  updateServings(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const n = raw === '' ? null : Number(raw);
    this.store.servings.set(Number.isFinite(n as number) ? (n as number) : null);
  }


  updateTags(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.tags.set(value);
  }

  // ================== Nutrición en Step-1 (usa value:string) ==================
  addNutrition() {
    this.store.nutritionItems.update(list => [
      ...list,
      { id: Date.now() + Math.floor(Math.random() * 1000), label: '', value: '', unit: '' } as UiNutrition
    ]);
  }
  private patchNutrition(i: number, patch: Partial<UiNutrition>) {
    this.store.nutritionItems.update(list => {
      const next = [...list] as UiNutrition[];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }
  editNutLabel(i: number, ev: Event) {
    this.patchNutrition(i, { label: (ev.target as HTMLInputElement).value });
  }
  editNutValue(i: number, ev: Event) {
    this.patchNutrition(i, { value: (ev.target as HTMLInputElement).value });
  }
  editNutUnit(i: number, ev: Event) {
    this.patchNutrition(i, { unit: (ev.target as HTMLInputElement).value });
  }
  removeNutrition(i: number) {
    this.store.nutritionItems.update(list => list.filter((_, idx) => idx !== i));
  }
  trackByNut(_idx: number, it: UiNutrition) { return it.id; }
}
