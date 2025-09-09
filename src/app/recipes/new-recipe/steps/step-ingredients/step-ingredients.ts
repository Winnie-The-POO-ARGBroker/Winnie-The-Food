import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewRecipeStore } from '../../new-recipe.js';

@Component({
  selector: 'app-step-ingredients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step-ingredients.html',
  styleUrls: ['../../new-recipe.css', './step-ingredients.css'],
})
export class StepIngredients {
  constructor(public store: NewRecipeStore) {}

  add() {
    this.store.ingredients.update(list => [...list, { name:'', qty:'', unit:'' }]);
  }

  edit(i: number, patch: Partial<ReturnType<NewRecipeStore['ingredients']>[number]>) {
    this.store.ingredients.update(list => {
      const next = [...list];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }
}
