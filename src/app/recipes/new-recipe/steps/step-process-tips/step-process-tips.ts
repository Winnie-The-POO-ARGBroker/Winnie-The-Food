import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NewRecipeStore } from '../../new-recipe.store';
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

  trackById = (_: number, item: { id: string }) => item.id;

  // handlers de UI
  editStepDesc(i: number, ev: Event) { this.store.updateStep(i, (ev.target as HTMLTextAreaElement).value); }
  addStep() { this.store.addStep(); }
  editTipDesc(i: number, ev: Event) { this.store.updateTip(i, (ev.target as HTMLTextAreaElement).value); }
  addTip() { this.store.addTip(); }

  // ---------- helpers para anidados ----------
  private ingredientsAsObjects() {
    return (this.store.ingredients() ?? [])
      .filter(i => (i?.name ?? '').trim())
      .map((i, idx) => {
        const qty  = (i?.qty ?? '').toString().trim();
        const unit = (i?.unit ?? '').toString().trim();
        const name = (i?.name ?? '').toString().trim();
        const left = [qty, unit].filter(Boolean).join(' ');
        const texto = left ? `${left} ${name}` : name;
        return { orden: idx + 1, texto };
      });
  }
  private stepsAsObjects() {
    return (this.store.steps() ?? [])
      .map((s, idx) => ({ orden: idx + 1, texto: (s?.description ?? '').trim() }))
      .filter(s => s.texto);
  }
  private tipsAsObjects() {
    return (this.store.tips() ?? [])
      .map((t, idx) => ({ orden: idx + 1, texto: (t?.description ?? '').trim() }))
      .filter(t => t.texto);
  }
  private nutritionAsObjects(): { label: string; valueNum: number | null }[] {
    return (this.store.nutritionItems() ?? [])
      .filter(n => (n?.label ?? '').trim())
      .map(n => ({
        label: (n!.label!).trim(),
        valueNum: n?.value != null && n?.value !== '' ? Number(n.value) : null
      }));
  }

  finalizarYVer() {
    const userId = this.auth.currentUser()?.id ?? 0;
    const editingId = this.store.editingId();
    const tags = (this.store.tags() ?? '')
    .split(',').map(t => t.trim()).filter(Boolean);

    const payloadBase = {
      autor_id: String(userId),
      nombre: (this.store.name() ?? '').trim(),
      descripcion: (this.store.description() ?? '').trim(),
      porciones: Number(this.store.servings() ?? 0) || 0,
      tiempoPrep: Number(this.store.prepMinutes() ?? 0) || 0,
      tiempoCoc: Number(this.store.cookMinutes() ?? 0) || 0,
      categoria: this.store.category() || null,
      dificultad: (() => {
        const d = (this.store.difficulty() ?? 'facil').toLowerCase();
        return d === 'media' ? 'medio' : d;
      })(),
      publicada: true,
      imageUrl: this.store.imageUrl() || 'https://blocks.astratic.com/img/general-img-landscape.png',
      enlace: null
    };

    const full = {
      ...payloadBase,
      ingredients: this.ingredientsAsObjects(),
      steps: this.stepsAsObjects(),
      tips: this.tipsAsObjects(),
      nutrition: this.nutritionAsObjects(),
      tags
    };

    const onOk = (r: any) => {
      this.store.clearDraft?.();
      this.store.resetAll();
      this.router.navigate(['/detail-recipe', r.id]);
    };

    if (editingId) {
      this.recipesSvc.updateReceta(String(editingId), full as any).subscribe({
        next: onOk,
        error: (e) => { console.error('[updateReceta]', e); alert('No se pudo actualizar la receta.'); }
      });
    } else {
      const withCreated = { ...full, creado_en: new Date().toISOString() };
      this.recipesSvc.createReceta(withCreated as any).subscribe({
        next: onOk,
        error: (e) => { console.error('[createReceta]', e); alert('No se pudo crear la receta.'); }
      });
    }

  }
}
