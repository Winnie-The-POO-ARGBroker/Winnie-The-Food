import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.store';

@Component({
  selector: 'app-step-ingredients',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './step-ingredients.html',
  styleUrl: './step-ingredients.css'
})
export class StepIngredients {
  store = inject(NewRecipeStore);
  trackByIng = (i: number) => i;

  add() { this.store.addIngredient(); }
  remove(i: number) { this.store.removeIngredient(i); }
  editIngName(i: number, ev: Event) { this.store.updateIngName(i, (ev.target as HTMLInputElement).value); }
  editIngQty (i: number, ev: Event) { this.store.updateIngQty(i,  (ev.target as HTMLInputElement).value); }
  editIngUnit(i: number, ev: Event) { this.store.updateIngUnit(i, (ev.target as HTMLSelectElement).value); }
}
