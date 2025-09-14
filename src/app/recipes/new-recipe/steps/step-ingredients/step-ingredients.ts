import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.js';

type Ingredient = { id: number; name: string; qty: string; unit: string };

@Component({
  selector: 'app-step-ingredients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-ingredients.html',
  styleUrls: ['../../new-recipe.css', './step-ingredients.css'],
})
export class StepIngredients {
  constructor(public store: NewRecipeStore) {}

  add(): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.store.ingredients.update(list => [...list, { id, name: '', qty: '', unit: '' }]);
  }

  /** Edita el ingrediente i con un patch parcial */
  private patch(i: number, patch: Partial<Ingredient>): void {
    this.store.ingredients.update(list => {
      const next = [...list];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  editIngName(i: number, ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.patch(i, { name: value });
  }

  editIngQty(i: number, ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.patch(i, { qty: value });
  }

  editIngUnit(i: number, ev: Event) {
    const value = (ev.target as HTMLSelectElement).value;
    this.patch(i, { unit: value });
  }

  remove(i: number) {
    this.store.ingredients.update(list => list.filter((_, idx) => idx !== i));
  }


  trackByIng(_index: number, item: Ingredient) { return item.id; }
}
