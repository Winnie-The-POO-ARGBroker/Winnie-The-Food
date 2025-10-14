import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.store';
import { RecipesService } from '../../../../services/recipes.service';
import { Categoria } from '../../../../models/categories-models';

@Component({
  selector: 'app-step-basic-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './step-basic-info.html',
  styleUrl: './step-basic-info.css'
})
export class StepBasicInfo {
  store = inject(NewRecipeStore);
  private svc = inject(RecipesService);

  categorias = signal<Categoria[]>([]);

  constructor() {
    this.svc.getCategorias().subscribe({
      next: cats => this.categorias.set(cats),
      error: e => console.error('[categorias]', e)
    });
  }

  updateName(ev: Event)        { this.store.setName((ev.target as HTMLInputElement).value); }
  updateDescription(ev: Event) { this.store.setDescription((ev.target as HTMLTextAreaElement).value); }
  updateCategory(ev: Event)    { this.store.setCategory((ev.target as HTMLSelectElement).value); }
  updateDifficulty(ev: Event)  { this.store.setDifficulty((ev.target as HTMLSelectElement).value); }
  updatePrepMinutes(ev: Event) { this.store.setPrepMinutes(toNumber((ev.target as HTMLInputElement).value)); }
  updateCookMinutes(ev: Event) { this.store.setCookMinutes(toNumber((ev.target as HTMLInputElement).value)); }
  updateServings(ev: Event)    { this.store.setServings(toNumber((ev.target as HTMLInputElement).value)); }
  updateTags(ev: Event)        { this.store.setTags((ev.target as HTMLInputElement).value); }
  updateImageUrl(ev: Event)    { this.store.setImageUrl((ev.target as HTMLInputElement).value.trim()); }

  addNutrition()                   { this.store.addNutrition(); }
  removeNutrition(i: number)       { this.store.removeNutrition(i); }
  editNutLabel(i: number, e: Event){ this.store.updateNutLabel(i, (e.target as HTMLInputElement).value); }
  editNutValue(i: number, e: Event){ this.store.updateNutValue(i, (e.target as HTMLInputElement).value); }

  persistDraft() { this.store.persistDraft(); }
}

function toNumber(v: string): number | null {
  const n = Number((v ?? '').toString().trim());
  return Number.isFinite(n) ? n : null;
}
