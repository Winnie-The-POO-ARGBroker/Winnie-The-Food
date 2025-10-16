import { Injectable, signal } from '@angular/core';

const DRAFT_KEY = 'new_recipe_draft';

export type StepItem = { id: string; description: string };
export type TipItem  = { id: string; description: string };
export type Ingredient = { id: string; name: string; qty?: number | string; unit?: string };
export type NutritionItem = { id: string; label: string; value?: number | string };

@Injectable({ providedIn: 'root' })
export class NewRecipeStore {
  // ---- básicos ----
  private _editingId     = signal<string | null>(null);
  private _name          = signal<string>('');
  private _description   = signal<string>('');
  private _imageUrl      = signal<string | null>(null);

  private _category      = signal<string>('entrada');
  private _difficulty    = signal<string>('facil'); // “media” → “medio” al enviar
  private _prepMinutes   = signal<number | null>(null);
  private _cookMinutes   = signal<number | null>(null);
  private _servings      = signal<number | null>(null);
  private _tags          = signal<string>('');

  // ---- colecciones ----
  private _nutrition     = signal<NutritionItem[]>([]);
  private _ingredients   = signal<Ingredient[]>([]);
  private _steps         = signal<StepItem[]>([]);
  private _tips          = signal<TipItem[]>([]);

  // getters usados en templates
  editingId   = () => this._editingId();
  name        = () => this._name();
  description = () => this._description();
  imageUrl    = () => this._imageUrl();

  category    = () => this._category();
  difficulty  = () => this._difficulty();
  prepMinutes = () => this._prepMinutes();
  cookMinutes = () => this._cookMinutes();
  servings    = () => this._servings();
  tags        = () => this._tags();

  nutritionItems = () => this._nutrition();
  ingredients    = () => this._ingredients();
  steps          = () => this._steps();
  tips           = () => this._tips();

  // setters básicos
  setEditingId (v: string | null) { this._editingId.set(v); }
  setName(v: string)              { this._name.set(v); }
  setDescription(v: string)       { this._description.set(v); }
  setImageUrl(url: string | null) { this._imageUrl.set(url); }

  setCategory(v: string)          { this._category.set(v); }
  setDifficulty(v: string)        { this._difficulty.set(v); }
  setPrepMinutes(v: number | null){ this._prepMinutes.set(v); }
  setCookMinutes(v: number | null){ this._cookMinutes.set(v); }
  setServings(v: number | null)   { this._servings.set(v); }
  setTags(v: string)              { this._tags.set(v); }

  // ---- reemplazos masivos (para precarga de edición) ----
  replaceIngredients(list: Ingredient[]) { this._ingredients.set(list ?? []); }
  replaceSteps(list: StepItem[])         { this._steps.set(list ?? []); }
  replaceTips(list: TipItem[])           { this._tips.set(list ?? []); }
  replaceNutrition(list: NutritionItem[]){ this._nutrition.set(list ?? []); }

  // ---- Nutrición fila a fila ----
  addNutrition() {
    this._nutrition.update(a => [...a, { id: crypto.randomUUID(), label: '', value: '' }]);
  }
  removeNutrition(i: number) { this._nutrition.update(a => a.filter((_, idx) => idx !== i)); }
  updateNutLabel(i: number, v: string)  { this._nutrition.update(a => a.map((n, idx) => idx === i ? { ...n, label: v } : n)); }
  updateNutValue(i: number, v: string | number) { this._nutrition.update(a => a.map((n, idx) => idx === i ? { ...n, value: v } : n)); }

  // ---- Ingredientes fila a fila ----
  addIngredient() { this._ingredients.update(a => [...a, { id: crypto.randomUUID(), name: '', qty: '', unit: '' }]); }
  removeIngredient(i: number) { this._ingredients.update(a => a.filter((_, idx) => idx !== i)); }
  updateIngName(i: number, v: string) { this._ingredients.update(a => a.map((it, idx) => idx === i ? { ...it, name: v } : it)); }
  updateIngQty (i: number, v: string | number) { this._ingredients.update(a => a.map((it, idx) => idx === i ? { ...it, qty: v } : it)); }
  updateIngUnit(i: number, v: string) { this._ingredients.update(a => a.map((it, idx) => idx === i ? { ...it, unit: v } : it)); }

  // ---- Pasos / Tips fila a fila ----
  addStep()  { this._steps.update(a => [...a, { id: crypto.randomUUID(), description: '' }]); }
  updateStep(i: number, v: string) { this._steps.update(a => a.map((s, idx) => idx === i ? { ...s, description: v } : s)); }

  addTip() { this._tips.update(a => [...a, { id: crypto.randomUUID(), description: '' }]); }
  updateTip(i: number, v: string) { this._tips.update(a => a.map((t, idx) => idx === i ? { ...t, description: v } : t)); }

  // ---- Draft opcional ----
  persistDraft = () => {
    const draft = {
      editingId: this._editingId(),
      name: this._name(), description: this._description(), imageUrl: this._imageUrl(),
      category: this._category(), difficulty: this._difficulty(),
      prepMinutes: this._prepMinutes(), cookMinutes: this._cookMinutes(), servings: this._servings(),
      tags: this._tags(), nutrition: this._nutrition(), ingredients: this._ingredients(),
      steps: this._steps(), tips: this._tips()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  clearDraft = () => { localStorage.removeItem(DRAFT_KEY); };

  loadDraft = () => {
    const raw = localStorage.getItem('new_recipe_draft'); if (!raw) return;
    try {
      const d = JSON.parse(raw);
      this._editingId.set(d.editingId ?? null);
      this._name.set(d.name ?? '');            this._description.set(d.description ?? '');
      this._imageUrl.set(d.imageUrl ?? null);
      this._category.set(d.category ?? 'entrada');
      this._difficulty.set(d.difficulty ?? 'facil');
      this._prepMinutes.set(d.prepMinutes ?? null); this._cookMinutes.set(d.cookMinutes ?? null);
      this._servings.set(d.servings ?? null); this._tags.set(d.tags ?? '');
      this._nutrition.set(d.nutrition ?? []); this._ingredients.set(d.ingredients ?? []);
      this._steps.set(d.steps ?? []);         this._tips.set(d.tips ?? []);
    } catch {}
  };

  resetAll = () => {
    this._editingId.set(null);
    this._name.set(''); this._description.set(''); this._imageUrl.set(null);
    this._category.set('entrada'); this._difficulty.set('facil');
    this._prepMinutes.set(null); this._cookMinutes.set(null); this._servings.set(null);
    this._tags.set('');
    this._nutrition.set([]); this._ingredients.set([]); this._steps.set([]); this._tips.set([]);
  };
}
