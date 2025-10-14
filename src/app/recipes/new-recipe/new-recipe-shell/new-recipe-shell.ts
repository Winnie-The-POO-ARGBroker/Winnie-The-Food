// src/app/recipes/new-recipe/new-recipe-shell/new-recipe-shell.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NewRecipeStore } from '../new-recipe.store';
import { RecipesService } from '../../../services/recipes.service';

@Component({
  selector: 'app-new-recipe-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-recipe-shell.html',
  styleUrls: ['../new-recipe.css', './new-recipe-shell.css'],
})
export class NewRecipeShell {
  private route = inject(ActivatedRoute);
  private svc   = inject(RecipesService);
  store        = inject(NewRecipeStore);

  activeStep = 1;

  constructor() {
    this.route.url.subscribe(segments => {
      const url = segments.map(s => s.path).join('/');
      this.activeStep = url.includes('step-3') ? 3 : url.includes('step-2') ? 2 : 1;
    });

    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.svc.getRecetaById(editId).subscribe({
        next: (r) => {
          this.store.setEditingId(String(r.id));
          this.store.setName(r.nombre ?? '');
          this.store.setDescription(r.descripcion ?? '');
          this.store.setImageUrl(r.imageUrl ?? null);

          this.store.setCategory(String(r.categoria ?? ''));

          this.store.setDifficulty(typeof r.dificultad === 'number'
            ? (r.dificultad as any) === 1 ? 'facil' : (r.dificultad as any) === 2 ? 'medio' : 'dificil'
            : (r.dificultad as any));

          this.store.setPrepMinutes(r.tiempoPrep ?? null);
          this.store.setCookMinutes(r.tiempoCoc ?? null);
          this.store.setServings(r.porciones ?? null);
          this.store.setTags((r as any).tags?.join(', ') ?? '');

          const ing = (r.ingredients ?? []).map(it => parseIngredient(it.texto ?? ''));
          const steps = (r.steps ?? []).map(it => ({ id: crypto.randomUUID(), description: it.texto ?? '' }));
          const tips  = (r.tips  ?? []).map(it => ({ id: crypto.randomUUID(), description: it.texto ?? '' }));
          const nutri = (r.nutrition ?? []).map(n => ({ id: crypto.randomUUID(), label: n.label, value: n.valueNum ?? '' }));

          this.store.replaceIngredients(ing);
          this.store.replaceSteps(steps);
          this.store.replaceTips(tips);
          this.store.replaceNutrition(nutri);
        },
        error: (e) => console.error('[precarga edición]', e)
      });
    }
    if (!editId) {
      this.store.clearDraft?.();
      this.store.resetAll();
    }
  }
}

function parseIngredient(texto: string) {
  const t = (texto ?? '').trim();
  const re = /^(\d+(?:[.,]\d+)?)\s+([a-zA-Záéíóúüñ\.]+)\s+(.+)$/i;
  const m = t.match(re);
  if (m) {
    const qty = m[1].replace(',', '.');
    const unit = m[2].toLowerCase();
    const name = m[3].trim();
    return { id: crypto.randomUUID(), name, qty, unit };
  }
  return { id: crypto.randomUUID(), name: t, qty: '', unit: '' };
}
