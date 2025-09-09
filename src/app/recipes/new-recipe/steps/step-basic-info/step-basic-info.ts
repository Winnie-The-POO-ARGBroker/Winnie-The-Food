import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewRecipeStore, type Difficulty } from '../../new-recipe.js';

@Component({
  selector: 'app-step-basic-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-basic-info.html',
  styleUrls: ['../../new-recipe.css', './step-basic-info.css'],
})
export class StepBasicInfo {
  constructor(public store: NewRecipeStore) {}

  // Imagen
  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.store.imageFile.set(file);
  }

  // Campos de texto
  updateName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.name.set(value);
  }

  updateDescription(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.store.description.set(value);
  }

  // Selects
  updateCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.category.set(value);
  }

  updateDifficulty(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Difficulty;
    this.store.difficulty.set(value);
  }

  // Tiempos (texto por ahora, visual)
  updatePrepMinutes(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.prepMinutes.set(value);
  }

  updateCookMinutes(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.cookMinutes.set(value);
  }

  // Porciones (number | null)
  updateServings(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const n = raw === '' ? null : Number(raw);
    this.store.servings.set(Number.isFinite(n as number) ? (n as number) : null);
  }

  // Etiquetas
  updateTags(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.tags.set(value);
  }
}
