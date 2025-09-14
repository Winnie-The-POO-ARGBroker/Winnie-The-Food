import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.store';
import { Receta } from '../../../../models/receta-model';
import { AuthService } from '../../../../services/auth.service';
import { RecipesService } from '../../../../services/recipes.service';

@Component({
  selector: 'app-step-process-tips',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './step-process-tips.html',
  styleUrl: './step-process-tips.css'
})
export class StepProcessTips {
  store = inject(NewRecipeStore);
  private router = inject(Router);
  private auth   = inject(AuthService);
  private recipesSvc = inject(RecipesService);

  private readonly LOCAL_KEY = 'recipes_local';
  trackById = (_: number, item: { id: string }) => item.id;

  // --- handlers ---
  editStepDesc(i: number, ev: Event) { this.store.updateStep(i, (ev.target as HTMLTextAreaElement).value); }
  addStep() { this.store.addStep(); }
  editTipDesc(i: number, ev: Event) { this.store.updateTip(i, (ev.target as HTMLTextAreaElement).value); }
  addTip() { this.store.addTip(); }

  // --- helpers ---
  private normalizeDifficulty(v: string): 'facil'|'medio'|'dificil' {
    return v === 'media' ? 'medio' : (v as any);
  }
  private ingredientsAsStrings(): string[] {
    return (this.store.ingredients() ?? [])
      .filter(i => i?.name?.trim())
      .map(i => {
        const qty = i?.qty?.toString().trim() || '';
        const unit = i?.unit?.trim() || '';
        const name = i?.name?.trim() || '';
        const left = [qty, unit].filter(Boolean).join(' ');
        return left ? `${left} ${name}` : name;
      });
  }
  private stepsAsStrings(): string[] {
    return (this.store.steps() ?? []).map(s => (s?.description ?? '').trim()).filter(Boolean);
  }
  private tipsAsStrings(): string[] {
    return (this.store.tips() ?? []).map(t => (t?.description ?? '').trim()).filter(Boolean);
  }
  private nutritionAsLabelValue(): {label: string; value: string}[] {
    return (this.store.nutritionItems() ?? [])
      .filter(n => n?.label)
      .map(n => ({
        label: n.label.trim(),
        value: n.unit ? `${n.value ?? ''} ${n.unit}` : String(n.value ?? '')
      }));
  }

  finalizarYVer() {
    const userId = this.auth.currentUser()?.id ?? 0; // <-- autor logueado

    // payload para el server (sin id → json-server lo crea)
    const serverPayload: Omit<Receta, 'id'> = {
      autor_id: userId as any,
      nombre: (this.store.name() ?? '').trim(),
      descripcion: (this.store.description() ?? '').trim(),
      porciones: Number(this.store.servings() ?? 0) || 0,
      tiempoPrep: Number(this.store.prepMinutes() ?? 0) || 0,
      tiempoCoc: Number(this.store.cookMinutes() ?? 0) || 0,
      categoria: (this.store.category() ?? '').trim(),
      dificultad: this.normalizeDifficulty(this.store.difficulty() ?? 'facil'),
      tipo_comida: 'Otros',
      publicada: true,
      imageUrl: this.store.imageDataUrl() || 'https://via.placeholder.com/300x200?text=Sin+imagen',
      tags: (this.store.tags() ?? '').split(',').map(t => t.trim()).filter(Boolean),
      ingredients: this.ingredientsAsStrings(),
      nutrition: this.nutritionAsLabelValue(),
      steps: this.stepsAsStrings(),
      tips: this.tipsAsStrings(),
      related: [],
      enlace: ''
    };

    // 1) Intentar publicar en el server
    this.recipesSvc.createReceta(serverPayload).subscribe({
      next: (created) => {

        this.store.persistDraft?.();
        this.router.navigate(['/detail-recipe', created.id]);
      },
      error: (e) => {
        console.error('[createReceta] falló, guardo en LocalStorage', e);

        // 2) Fallback: guardar local para no perder el trabajo
        const localId = `ls-${Date.now()}`;
        const localReceta: Receta = {
          id: localId as any,
          ...serverPayload,
          enlace: `/detail-recipe/${localId}`
        };
        this.recipesSvc.saveLocal(localReceta);

        this.store.persistDraft?.();
        this.router.navigate(['/detail-recipe', localId]);
      }
    });
  }
}
