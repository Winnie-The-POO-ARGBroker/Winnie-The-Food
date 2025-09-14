// src/app/recipes/new-recipe/new-recipe.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import type { Receta } from '../../models/receta-model';

export type Difficulty = 'facil' | 'medio' | 'dificil';
type Ing  = { name: string; qty: string; unit: string };
type Step = { title: string; description: string };
type Tip  = { title: string; description: string };

const DRAFT_KEY = 'newRecipe.draft.v1';
const LOCAL_COLLECTION_KEY = 'newRecipe.collection.v1';

@Injectable({ providedIn: 'root' })
export class NewRecipeStore {
  imageFile    = signal<File | null>(null);
  imageDataUrl = signal<string | null>(null);

  name        = signal('');
  description = signal('');
  category    = signal('Entrada');
  difficulty  = signal<Difficulty>('facil');

  prepMinutes = signal('');
  cookMinutes = signal('');

  servings = signal<number | null>(null);
  tags     = signal('');

  ingredients = signal<Ing[]>([{ name:'', qty:'', unit:'' }]);
  steps       = signal<Step[]>([{ title:'', description:'' }]);
  tips        = signal<Tip[]>([]);

  totalTime = computed(() => {
    const p = Number(this.prepMinutes());
    const c = Number(this.cookMinutes());
    const sum = (isFinite(p) ? p : 0) + (isFinite(c) ? c : 0);
    return sum > 0 ? `${sum} min` : '—';
  });

  constructor(private auth: AuthService) { this.restoreDraft(); }

  // ----------------- borrador -----------------
  persistDraft() {
    const json = JSON.stringify(this.asDraftJson());
    try {
      localStorage.setItem(DRAFT_KEY, json);
    } catch {
      // Si no entra por tamaño, guardamos sin imagen para no romper el flujo
      try {
        const lite = { ...this.asDraftJson(), imageDataUrl: null };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(lite));
      } catch { /* no-op */ }
    }
  }

  restoreDraft() {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      this.imageDataUrl.set(d.imageDataUrl ?? null);
      this.name.set(d.name ?? '');
      this.description.set(d.description ?? '');
      this.category.set(d.category ?? 'Entrada');
      this.difficulty.set((d.difficulty ?? 'facil') as Difficulty);
      this.prepMinutes.set(d.prepMinutes ?? '');
      this.cookMinutes.set(d.cookMinutes ?? '');
      this.servings.set(d.servings ?? null);
      this.tags.set(d.tags ?? '');
      this.ingredients.set(Array.isArray(d.ingredients) && d.ingredients.length ? d.ingredients : [{ name:'', qty:'', unit:'' }]);
      this.steps.set(Array.isArray(d.steps) && d.steps.length ? d.steps : [{ title:'', description:'' }]);
      this.tips.set(Array.isArray(d.tips) ? d.tips : []);
    } catch { /* no-op */ }
  }

  clearDraft() { localStorage.removeItem(DRAFT_KEY); }

  // ----------------- finalizar -----------------
  finalizeAndSave(): number {
    const localId = Date.now();
    const col = this.getLocalCollection();

    const receta = this.toReceta(localId);

    
    try {
      col.unshift(receta);
      localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(col));
    } catch {

      const lite = { ...receta, imageUrl: '/placeholder-recipe.webp' };
      try {
        col.unshift(lite);
        localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(col));
      } catch { /* no-op */ }
    }

    this.clearDraft();
    this.reset();
    return localId;
  }

  // ----------------- helpers -----------------
  private asDraftJson() {
    return {
      imageDataUrl: this.imageDataUrl(),
      name: this.name(),
      description: this.description(),
      category: this.category(),
      difficulty: this.difficulty(),
      prepMinutes: this.prepMinutes(),
      cookMinutes: this.cookMinutes(),
      servings: this.servings(),
      tags: this.tags(),
      ingredients: this.ingredients(),
      steps: this.steps(),
      tips: this.tips()
    };
  }

  private getLocalCollection(): Receta[] {
    const raw = localStorage.getItem(LOCAL_COLLECTION_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as Receta[]; } catch { return []; }
  }

  private n(str: string) { const n = Number(str); return isFinite(n) ? n : 0; }

  private toReceta(localId: number): Receta {
    const user = this.auth.currentUser();
    const tagsArr = this.tags().split(',').map(s => s.trim()).filter(Boolean);
    const ingArr  = this.ingredients()
      .map(i => [i.name, `${i.qty}${i.unit ? ' ' + i.unit : ''}`.trim()].filter(Boolean).join(' '))
      .filter(Boolean);
    const steps = this.steps().map(s => s.title ? `${s.title}: ${s.description}` : s.description).filter(Boolean);
    const tips  = this.tips().map(t => t.title ? `${t.title}: ${t.description}` : t.description).filter(Boolean);

    return {
      id: localId,
      autor_id: user?.id ?? 0,
      nombre: this.name(),
      descripcion: this.description(),
      porciones: this.servings() ?? 0,
      tiempoPrep: this.n(this.prepMinutes()),
      tiempoCoc:  this.n(this.cookMinutes()),
      categoria: this.category(),
      dificultad: this.difficulty(),
      tipo_comida: 'Casera',
      publicada: true,
      imageUrl: this.imageDataUrl() ?? '/placeholder-recipe.webp',
      tags: tagsArr,
      ingredients: ingArr,
      nutrition: [],
      steps,
      tips,
      related: [],
      enlace: `/detail-recipe/${localId}`
    };
  }

  private reset() {
    this.imageFile.set(null);
    this.imageDataUrl.set(null);
    this.name.set('');
    this.description.set('');
    this.category.set('Entrada');
    this.difficulty.set('facil');
    this.prepMinutes.set('');
    this.cookMinutes.set('');
    this.servings.set(null);
    this.tags.set('');
    this.ingredients.set([{ name:'', qty:'', unit:'' }]);
    this.steps.set([{ title:'', description:'' }]);
    this.tips.set([]);
  }
}
